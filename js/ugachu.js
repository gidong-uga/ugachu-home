let images = [];
let current = 0;

const photo = document.getElementById("photo");

// JSON 불러오기 (포켓몬 도감용)
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
    photo.src = "./images/about me/na/" + images[current];
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


// --------------------------------------------------
// 📂 아래 좋아하는 것 도감 (favorite.json 불러오기)
// --------------------------------------------------
(() => {
    const dexGrid = document.getElementById('dex-grid');

    fetch('./data/favorite.json')
        .then(response => response.json())
        .then(favImages => {
            if (!dexGrid) return;

            dexGrid.innerHTML = ''; // 초기화

            favImages.forEach(imgPath => {
                const itemHtml = `
                    <div class="dex-item">
                         <img src="./images/about me/like/${imgPath}" alt="도감 이미지">
                    </div>
                `;
                dexGrid.innerHTML += itemHtml;
            });
        })
        .catch(error => console.error('favorite.json 불러오기 실패:', error));
})();

const calendarId = "gidongj590@gmail.com";
const apiKey = "AIzaSyCAi1x56WDS5SdAGpD3NUHowr2tDtd9CHs";

const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}`;

fetch(url)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP 에러 발생! 상태 코드: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log('이벤트 목록:', data.items);
  })
  .catch(err => {
    console.error('요청 실패:', err.message);
  });

let currentDate = new Date(2026, 6, 1); // 2026년 7월 (월은 0부터 시작하므로 6 = 7월)

// ==========================================
// 2. 초기 실행
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentDate); // 1. 달력 틀부터 먼저 그리기
    fetchGoogleEvents();        // 2. 구글 일정 가져와서 ⭐ 표시하기
});

// ==========================================
// 3. 달력 화면에 그리는 함수
// ==========================================
function renderCalendar(date) {
    const calendarBody = document.getElementById('calendar-body');
    const calendarTitle = document.getElementById('calendar-title');
    
    if (!calendarBody) return;

    const year = date.getFullYear();
    const month = date.getMonth();

    // 헤더 제목 변경 (ex: 2026.07)
    calendarTitle.innerText = `${year}.${String(month + 1).padStart(2, '0')}`;

    // 해당 월의 첫 날과 마지막 날 계산
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = ''; // 기존 달력 초기화
    let row = document.createElement('tr');

    // 첫 주 빈칸 채우기
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('td');
        emptyCell.classList.add('other-month');
        row.appendChild(emptyCell);
    }

    // 1일부터 마지막 날까지 날짜 채우기
    for (let day = 1; day <= lastDate; day++) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }

        const cell = document.createElement('td');
        cell.innerText = day;
        cell.setAttribute('data-date', `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);

        // 오늘 날짜 체크 (CSS .today 적용)
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            cell.classList.add('today');
        }

        row.appendChild(cell);
    }

    // 마지막 주 남은 빈칸 채우기
    while (row.children.length < 7) {
        const emptyCell = document.createElement('td');
        emptyCell.classList.add('other-month');
        row.appendChild(emptyCell);
    }
    calendarBody.appendChild(row);
}

// ==========================================
// 4. 구글 캘린더 API 일정 불러와서 ⭐ 찍기
// ==========================================
function fetchGoogleEvents() {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('API 호출 실패');
            return res.json();
        })
        .then(data => {
            if (!data.items) return;

            // 일정 날짜 추출하여 해당 td에 .event 클래스 추가
            data.items.forEach(event => {
                const eventStart = event.start.date || event.start.dateTime;
                if (eventStart) {
                    const dateStr = eventStart.split('T')[0]; // YYYY-MM-DD 형태
                    const targetCell = document.querySelector(`td[data-date="${dateStr}"]`);
                    if (targetCell) {
                        targetCell.classList.add('event'); // CSS에서 ⭐ 찍히도록 설정되어 있음
                    }
                }
            });
        })
        .catch(err => console.warn('일정을 불러올 수 없습니다 (캘린더 공개 설정을 확인하세요):', err.message));
}