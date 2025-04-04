const fs = require("fs");
const path = require("path");

const title = process.env.ISSUE_TITLE || "";
const body = process.env.ISSUE_BODY || "";

const nameMatch = title.match(/^New Recipe:\s*(.+)$/);
const name = nameMatch ? nameMatch[1].trim() : "Unnamed Recipe";

const descMatch = body.match(/\*\*Ingredients & Instructions:\*\*\n([\s\S]*?)\n\n/);
const desc = descMatch ? descMatch[1].trim() : "No instructions provided.";

const imagesMatch = body.match(/\*\*Images:\*\*\n([\s\S]*)/);
const imageList = imagesMatch ? imagesMatch[1].trim().split("\n").filter(Boolean) : [];

const fileSafeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const filename = `recipes/${fileSafeName}.html`;

// Create the HTML page
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${name}</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <h1>${name}</h1>
    <p>${desc.replace(/\n/g, "<br>")}</p>
    ${imageList.map(img => `<img src="${img}" style="max-width:100%;margin-bottom:1rem;">`).join("\n")}
</body>
</html>
`;
fs.writeFileSync(filename, htmlContent);

// Update recipes.json
const recipesPath = "recipes.json";
let recipes = [];
if (fs.existsSync(recipesPath)) {
    recipes = JSON.parse(fs.readFileSync(recipesPath, "utf-8"));
}
recipes.push({
    name: name,
    image: imageList[0] || "",
    filename: filename
});
fs.writeFileSync(recipesPath, JSON.stringify(recipes, null, 2));

console.log(`Recipe "${name}" added to ${filename} and recipes.json.`);
