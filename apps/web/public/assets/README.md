# Farming Game Pixel Assets

## Required Assets from Kenney.nl

### Download Sources
- **Kenney Pixelart TopDown**: https://kenney.nl/assets/pixelart-topdown
- **Kenney RPG Pack**: https://kenney.nl/assets/rpg-pack
- **Kenney Particles**: https://kenney.nl/assets/particle-pack
- **Kenney Sky**: https://kenney.nl/assets/sky
- **Kenney UI Pack**: https://kenney.nl/assets/ui-pack

### Required Files

#### Tiles (public/assets/tiles/)
- [ ] `grass.png` - 草地背景
- [ ] `soil.png` - 耕地背景
- [ ] `wet_soil.png` - 湿润土壤（雨天）
- [ ] `path.png` - 小路

#### Crops (public/assets/crops/)
- [ ] `wheat.png` - 小麦 Sprite
- [ ] `carrot.png` - 胡萝卜 Sprite
- [ ] `tomato.png` - 番茄 Sprite
- [ ] `corn.png` - 玉米 Sprite
- [ ] `sunflower.png` - 向日葵 Sprite
- [ ] `watermelon.png` - 西瓜 Sprite

#### Weather (public/assets/weather/)
- [ ] `rain.png` - 雨滴粒子
- [ ] `snow.png` - 雪花粒子
- [ ] `clouds.png` - 云朵背景

#### UI (public/assets/ui/)
- [ ] `panel.png` - 像素风格面板背景
- [ ] `button.png` - 像素风格按钮

#### Background (public/assets/background/)
- [ ] `spring.png` - 春季背景色调
- [ ] `summer.png` - 夏季背景色调
- [ ] `autumn.png` - 秋季背景色调
- [ ] `winter.png` - 冬季背景色调

### Asset Specifications

#### Sprite Sheet Format
```
Crop Sprite Sheet Structure:
- Each crop: 4 frames (seed, growing, mature, ready)
- Frame size: 32x32 pixels
- Total sheet size: 128x32 pixels per crop
```

#### Background Tiles
- Tile size: 32x32 pixels
- Seamless tiling (edges match)

### Download Instructions

1. Visit https://kenney.nl
2. Search for "Pixelart TopDown" and download
3. Search for "RPG Pack" and download
4. Search for "Particle Pack" and download
5. Extract and copy relevant files to `public/assets/`

### Fallback

If assets are not available, use the placeholder SVG files in `public/assets/placeholders/`
