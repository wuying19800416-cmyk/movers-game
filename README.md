# Movers Game V2

這是一個專為國小 1-3 年級設計的英語單字學習遊戲，包含 **Memory Match (記憶翻牌)**、**Spelling Bee (拼字測驗)** 和 **Word Fill (填空挑戰)** 三種模式。

## 🚀 快速開始

### 1. 安裝依賴
第一次下載專案後，請執行以下指令安裝必要的套件：
```bash
npm install
```

### 2. 啟動開發伺服器
在本地端測試遊戲（網址通常是 http://localhost:5173）：
```bash
npm run dev
```

---

## 🛠️ 如何修改內容

### 修改單字表
編輯 `src/data/words.ts` 檔案：
- **增加單字**：在 `ALL_VOCAB` 陣列中新增物件 `{ word: 'apple', key: 'n', emoji: '🍎' }`。
- **修改圖片/Emoji**：直接更換 emoji 欄位。

### 修改遊戲參數
編輯 `src/hooks/useGameLogic.ts`：
- **調整分數**：搜尋 `setScore(s => s + 20)` 修改得分。
- **調整語音速度**：修改 `u.rate = 0.9` (數值越小越慢)。

### 修改外觀 (CSS)
編輯 `src/styles/index.css`：
- **更換主題色**：修改 `:root` 中的 `--color-primary` 等變數。

---

## 📦 如何更新線上版本 (GitHub Pages)

當你完成修改並測試沒問題後，執行以下指令將新版本發布到 GitHub：

```bash
# 1. 提交程式碼變更
git add .
git commit -m "描述你的修改內容"
git push

# 2. 建置並部署到 GitHub Pages
npm run deploy
```

部署完成後，等待約 1-2 分鐘，線上版本就會自動更新：
👉 https://wuying19800416-cmyk.github.io/movers-game/
