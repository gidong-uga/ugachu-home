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


// 좋아하는 것 도감 (favorite.json)

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

document.addEventListener("DOMContentLoaded", () => {
    // 아스키 아트 목록 (나중에 반점이랑 백틱 넣어서 추가 가능!)
    const asciiList = [
    // 1번 아스키 아트
    `   __                            
  / /  ___ ____  ___ ____ ___ __
 / _ \\/ _ \`/ _ \\/ _ \`/ _ \`/ // /
/_.__/\\_,_/_//_/\\_, /\\_, /\\_,_/ 
               /___//___/       `,

    // 2번 아스키 아트
    `     __   __               
 ___/ /__/ /__  ___  ___ _
/ _  / _  / _ \\/ _ \\/ _ \`/
\\_,_/\\_,_/\\___/_//_/\\_, / 
                   /___/  `,

    // 3번 아스키 아트
    `  __  __          __  __          
 / / / /__ ____ _/ / / /__ ____ _ 
/ /_/ / _ \`/ _ \`/ /_/ / _ \`/ _ \`/ 
\\____/\\_, /\\_,_/\\____/\\_, /\\_,_/  
     /___/           /___/        `
];

    // 랜덤으로 선택해서 화면에 출력
    const randomIndex = Math.floor(Math.random() * asciiList.length);
    const asciiElement = document.getElementById("ascii-art");
    
    if (asciiElement) {
        asciiElement.textContent = asciiList[randomIndex];
    }
});

// 1. 달력

const calendarId = "gidongj590@gmail.com";
const apiKey = "AIzaSyATv4Lolc67J_QhJGr9Bv5xpClNnpXb9QQ";

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
    fetchGoogleEvents();        // 2. 구글 일정 가져오기
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
// 4. 구글 캘린더 API 일정 불러와서 표시하기
// ==========================================
function fetchGoogleEvents() {
    // 1. 달 변경 시 이전 일정 텍스트 지우기 (중복 방지)
    document.querySelectorAll('.event-title').forEach(el => el.remove());

    // 2. 현재 보고 있는 달의 시작일과 마지막 날 ISO 계산
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const timeMin = new Date(year, month, 1, 0, 0, 0).toISOString();
    const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

    // 3. 해당 월의 모든 일정을 요청하는 URL 구성
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&maxResults=2500&orderBy=startTime`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('API 호출 실패');
            return res.json();
        })
        .then(data => {
            if (!data.items) return;

            data.items.forEach(event => {
                const eventStart = event.start.date || event.start.dateTime;
                if (eventStart) {
                    const dateStr = eventStart.split('T')[0]; // YYYY-MM-DD 형태
                    const targetCell = document.querySelector(`td[data-date="${dateStr}"]`);

                    if (targetCell) {
                        // 일정 제목 추출 (없을 경우 기본값)
                        const eventTitle = event.summary || '일정';

                        // 일정 텍스트 요소를 담을 div 생성
                        const eventDiv = document.createElement('div');
                        eventDiv.classList.add('event-title');
                        eventDiv.innerText = eventTitle;

                        // 해당 날짜 셀에 일정 추가
                        targetCell.appendChild(eventDiv);
                        targetCell.classList.add('has-event');
                    }
                }
            });
        })
        .catch(err => console.warn('일정을 불러올 수 없습니다:', err.message));
}

// 달력 이동 이벤트 연결 (DOMContentLoaded 안이나 코드 하단에 추가)
const prevBtn = document.getElementById("prev-month"); // 이전달 버튼 ID에 맞춰 수정
const nextBtn = document.getElementById("next-month"); // 다음달 버튼 ID에 맞춰 수정

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        // currentDate의 월을 1개월 추가
        currentDate.setMonth(currentDate.getMonth() + 1);
        // 변경된 날짜로 달력 재렌더링
        renderCalendar(currentDate);
        // 변경된 달의 일정 다시 불러오기
        fetchGoogleEvents();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        // currentDate의 월을 1개월 차감
        currentDate.setMonth(currentDate.getMonth() - 1);
        // 변경된 날짜로 달력 재렌더링
        renderCalendar(currentDate);
        // 변경된 달의 일정 다시 불러오기
        fetchGoogleEvents();
    });
}