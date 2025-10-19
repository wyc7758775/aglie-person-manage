
#!/usr/bin/env bash
set -euo pipefail

# 说明：
# - 从 manifest.json 读取包名(name)与版本(version)
# - 支持传入参数：latest 或具体版本号（如 1.0.3）
# - 自动追加架构后缀（默认 amd64），生成镜像标签与导出文件名
# - 仅在 192.168.31.* 局域网且 NAS SSH 可达时执行 scp 上传
# - 可通过环境变量覆盖：ARCH、NODE_IMAGE、IMAGE_NAME、NAS_USER、NAS_IP、NAS_PORT、NAS_PATH

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ARCH="${ARCH:-amd64}"
NODE_IMAGE="${NODE_IMAGE:-docker.m.daocloud.io/library/node:20-alpine}"

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

echo "[构建] 镜像：${IMAGE_NAME}:${TAG} | 平台：linux/${ARCH}"
echo "[构建] 基础镜像：${NODE_IMAGE}"

docker buildx build \
  --platform "linux/${ARCH}" \
  -t "${IMAGE_NAME}:${TAG}" \
  --build-arg "NODE_IMAGE=${NODE_IMAGE}" \
  --load \
  "$ROOT_DIR"

# 导出镜像包到 docker-images 目录
OUT_DIR="$ROOT_DIR/docker-images"
mkdir -p "$OUT_DIR"
OUT_FILE="${OUT_DIR}/${IMAGE_NAME}_${TAG}.tar.gz"
echo "[导出] 文件：${OUT_FILE}"
docker save "${IMAGE_NAME}:${TAG}" | gzip > "${OUT_FILE}"
ls -lh "${OUT_FILE}" || true

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
  echo "[上传] 局域网可达，准备通过 scp 上传到 ${NAS_USER}@${NAS_IP}:${NAS_PATH}"
  scp -o ConnectTimeout=5 -P "$NAS_PORT" "$OUT_FILE" "${NAS_USER}@${NAS_IP}:${NAS_PATH}" || echo "[上传] scp 失败，已跳过。"
else
  echo "[上传] 未在 192.168.31.* 局域网或 NAS SSH 不可达，跳过 scp 上传。"
fi

echo "[完成] 镜像标签：${IMAGE_NAME}:${TAG}"
