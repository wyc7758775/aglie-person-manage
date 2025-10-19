
#!/usr/bin/env bash
set -euo pipefail

# 说明：
# - 从 manifest.json 读取包名(name)与版本(version)
# - 支持传入参数：latest 或具体版本号（如 1.0.3）
# - 自动追加架构后缀（默认 amd64），生成镜像标签与导出文件名
# - 仅在 192.168.31.* 局域网且 NAS SSH 可达时执行 sftp 上传（默认上传到 /docker/，可用 NAS_PATH 覆盖）
# - 可通过环境变量覆盖：ARCH、NODE_IMAGE、IMAGE_NAME、NAS_USER、NAS_IP、NAS_PORT、NAS_PATH
# - 已存在导出包则跳过构建（可用 FORCE_REBUILD=1 强制重建）
# - 为避免多次密码提示，不额外进行 SSH 路径探测；如需自定义目录请使用绝对路径（例如 /docker/ 或 /obsidian/）

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ARCH="${ARCH:-amd64}"
NODE_IMAGE="${NODE_IMAGE:-docker.m.daocloud.io/library/node:20-alpine}"
FORCE_REBUILD="${FORCE_REBUILD:-0}"

# 从 manifest.json 读取 name/version，失败则回退到 package.json
NAME=$(node -e 'try{console.log(require("./manifest.json").name||"")}catch(e){process.exit(1)}' 2>/dev/null || true)
VERSION=$(node -e 'try{console.log(require("./manifest.json").version||"")}catch(e){process.exit(1)}' 2>/dev/null || true)

if [[ -z "$NAME" ]]; then
  NAME=$(node -e 'try{console.log(require("./package.json").name||"")}catch(e){process.exit(1)}' 2>/dev/null || true)
fi
if [[ -z "$VERSION" ]]; then
  VERSION=$(node -e 'try{console.log(require("./package.json").version||"")}catch(e){process.exit(1)}' 2>/dev/null || true)
fi

IMAGE_NAME="${IMAGE_NAME:-$NAME}"
[[ -z "$IMAGE_NAME" ]] && IMAGE_NAME="nextjs-dashboard"

INPUT_VERSION="${1:-}"  # 允许传入 latest 或具体版本号
if [[ "$INPUT_VERSION" == "latest" ]]; then
  TAG="latest"
else
  BASE_VER="${INPUT_VERSION:-$VERSION}"
  if [[ -z "$BASE_VER" ]]; then
    echo "未能获取版本号。用法：bash plugins/docker-build.sh <version|latest> 或确保 manifest.json/package.json 有 version 字段。" >&2
    exit 1
  fi
  if [[ "$BASE_VER" == *"-${ARCH}" ]]; then
    TAG="$BASE_VER"
  else
    TAG="${BASE_VER}-${ARCH}"
  fi
fi

# 导出文件路径
OUT_DIR="$ROOT_DIR/docker-images"
mkdir -p "$OUT_DIR"
OUT_FILE="${OUT_DIR}/${IMAGE_NAME}_${TAG}.tar.gz"

if [[ -s "$OUT_FILE" && "$FORCE_REBUILD" != "1" ]]; then
  echo "[跳过构建] 已存在导出文件：${OUT_FILE}"
else
  echo "[构建] 镜像：${IMAGE_NAME}:${TAG} | 平台：linux/${ARCH}"
  echo "[构建] 基础镜像：${NODE_IMAGE}"

  docker buildx build \
    --platform "linux/${ARCH}" \
    -t "${IMAGE_NAME}:${TAG}" \
    --build-arg "NODE_IMAGE=${NODE_IMAGE}" \
    --load \
    "$ROOT_DIR"

  echo "[导出] 文件：${OUT_FILE}"
  docker save "${IMAGE_NAME}:${TAG}" | gzip > "${OUT_FILE}"
  ls -lh "${OUT_FILE}" || true
fi

# 局域网内自动上传到 NAS（可选）
NAS_USER="${NAS_USER:-yoran}"
NAS_IP="${NAS_IP:-192.168.31.229}"
NAS_PORT="${NAS_PORT:-22}"
NAS_PATH="${NAS_PATH:-~/docker-images/}"

LOCAL_IP="$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || ipconfig getifaddr en5 || true)"
IN_LAN=false
[[ -n "$LOCAL_IP" && "$LOCAL_IP" =~ ^192\.168\.31\. ]] && IN_LAN=true

if $IN_LAN \
  && ping -c 1 -W 1 "$NAS_IP" >/dev/null 2>&1 \
  && nc -w 1 -z "$NAS_IP" "$NAS_PORT" >/dev/null 2>&1; then
  # 解析目标路径（避免额外 SSH 交互，默认使用 /docker/）
  if [[ -z "$NAS_PATH" || "$NAS_PATH" == "~/"* ]]; then
    [[ "$NAS_PATH" == "~/"* ]] && echo "[上传] 检测到 '~/'，NAS 可能不支持 HOME 展开，改用默认 /docker/。"
    NAS_PATH_RESOLVED="/docker/"
  else
    NAS_PATH_RESOLVED="$NAS_PATH"
  fi

  echo "[上传] 使用 sftp 上传到：${NAS_PATH_RESOLVED}（失败将自动回退到 /docker/）"
  SFTP_CMDS=$(printf "put %s %s\n" "$OUT_FILE" "$NAS_PATH_RESOLVED")
  if [[ "$NAS_PATH_RESOLVED" != "/docker/" ]]; then
    SFTP_CMDS=$(printf "%s\nput %s /docker/\n" "$SFTP_CMDS" "$OUT_FILE")
  fi

  printf "%s\n" "$SFTP_CMDS" | \
    sftp -o StrictHostKeyChecking=accept-new -P "$NAS_PORT" "${NAS_USER}@${NAS_IP}" \
    && echo "[上传] sftp 完成（如无错误提示则成功）" \
    || echo "[上传] sftp 失败，已跳过。"
else
  echo "[上传] 未在 192.168.31.* 局域网或 NAS SSH 不可达，跳过上传。"
fi

echo "[完成] 镜像标签：${IMAGE_NAME}:${TAG}"
