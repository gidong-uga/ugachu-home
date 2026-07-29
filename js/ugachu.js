let images = [];
let current = 0;

const photo = document.getElementById("photo");

// JSON 불러오기
async function loadData() {
    try {
        const response = await fetch("./data/ugachu.json");
        images = await response.json();

        if (images.length > 0) {
            showImage();
        }
    } catch (error) {
        console.error("JSON을 불러오지 못했습니다.", error);
    }
}

// 현재 사진 표시
function showImage() {
    photo.src = "./images/na/" + images[current];
    photo.alt = images[current];
}

// 다음 사진
function nextImage() {
    current++;

    if (current >= images.length) {
        current = 0;
    }

    showImage();
}

// 이전 사진
function prevImage() {
    current--;

    if (current < 0) {
        current = images.length - 1;
    }

    showImage();
}

// 버튼 이벤트
document.getElementById("right").addEventListener("click", nextImage);
document.getElementById("left").addEventListener("click", prevImage);

// 키보드 방향키
document.addEventListener("keydown", function(e){

    if(e.key === "ArrowRight"){
        nextImage();
    }

    if(e.key === "ArrowLeft"){
        prevImage();
    }

});

// 시작
loadData();