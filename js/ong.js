let highestZ = 1;
const stickerBook = document.getElementById("kkaong");

async function LoadCats() {
    const response = await fetch("./data/ong.json");
    const data = await response.json();
    data.forEach((cat) => {
        const img = document.createElement("img");
        img.src = `./images/cats/${cat}`;
        img.classList.add("kkaong");
        stickerBook.appendChild(img);
        const size = Math.floor(Math.random() * 180) + 180;
        img.style.width = `${size}px`;
        
        const duration = (3 + Math.random() * 3).toFixed(2);
        const delay = (Math.random() * 3).toFixed(2);

        img.style.animationDuration = `${duration}s`;
        img.style.animationDelay = `-${delay}s`;

        let x;
        let y;

        do {
            x = Math.floor(Math.random() * (window.innerWidth - size));
            y = Math.random() * 1800;
        } while (isOverlapping(x, y, size, size));

        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        placedSticker.push({ x, y, width: size * 0.7, height: size * 0.7 });

        stickerBook.appendChild(img);

        img.addEventListener("mousedown", (e) => {
            activeSticker = img;

            offsetX = e.clientX - img.offsetLeft;
            offsetY = e.clientY - img.offsetTop;

            img.classList.add("dragging");
            img.style.rotate = `${Math.random() *4-2}deg`;
            img.style.zIndex = ++highestZ;
        });
    });

}

const placedSticker = [];

let activeSticker = null;

let offsetX = 0;
let offsetY = 0;

function isOverlapping(x, y, width, height) {
    for (const sticker of placedSticker) {

        if (
            x < sticker.x + sticker.width &&
            x + width > sticker.x &&
            y < sticker.y + sticker.height &&
            y + height > sticker.y
        ) {
            return true;
        }
    }
    return false;
}

document.addEventListener("mousemove", (e) => {

    if (!activeSticker) return;

    activeSticker.style.left = `${e.clientX - offsetX}px`;
    activeSticker.style.top = `${e.clientY - offsetY}px`;
});
document.addEventListener("mouseup", () => {
    if (activeSticker) {
        activeSticker.classList.remove("dragging");
        activeSticker.style.rotate = "0deg";
    }
    activeSticker = null;
});

LoadCats();