# Quick Windows Setup - 2 Minutes

## Step 1: Open Command Prompt
1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Type: `cd "C:\Users\preet\Desktop\Project_1-main"`
4. Press Enter

## Step 2: Install Dependencies (One Time Only)
```
npm install
```

## Step 3: Try These Methods (One Will Work)

### Method A: Build and Run
```
npm run build
npm start
```

### Method B: Windows Batch File
```
run-windows-direct.bat
```

### Method C: Compatible ts-node
```
run-ts-node-windows.bat
```

### Method D: Direct Node
```
node server/index-windows.cjs
```

## Expected Result
- See "serving on port 5000"
- Open browser: http://localhost:5000
- Login: admin@sportzalfitness.com / admin123

## If Still Not Working
The project has ES module issues on Windows. Try this final method:

1. Open `package.json`
2. Remove the line: `"type": "module"`
3. Save file
4. Run: `npx ts-node server/index.ts`

This will convert the project to CommonJS and should work immediately.