// 1. 웹서버 연동
// 2. BASE_URL 선언
// 3. 비동기 처리 부분 확인, 웹서버 요청 코딩
// 4. 서버 데이터 요청 후, 렌더링
// 5. 리팩토링 
// - API 파일 분리
// - 페이지 렌더링 관련 중복 제거
// - 서버 요청시 option 객체
// -카테고리 버튼 클릭시 콜백 함수 분리
// 6. 사용자 경험 부분

// TODO 서버 요청 
// - [X] 웹 서버를 띄운다.
// - [X] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
// - [X] 서버에 카테고리별 메뉴 리스트를 불러온다.
// - [X] 서버에 메뉴가 수정될 수 있도록 요청한다.
// - [X] 서버에 메뉴 품절상태를 토글할 수 있도록 요청한다.
// - [X] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// TODO 리팩토링
// - [X] localStorage에 저장하는 로직은 지운다.
// - [X] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// - [X] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 예외처리를 진행한다.
// - [X] 중복되는 메뉴는 추가할 수 없다.

import {$} from "./utils/dom.js"
// import storage from "./storage/index.js"
import MenuApi from "./api/index.js";

function App() {
    // 상태(변하는 데이터) - 메뉴명, 현재 카테고리(espresso)
    this.currentCategory = "espresso";
    this.menu = {
        espresso : [],
        frappuccino: [],
        blended : [],
        teavana : [],
        desert : []
    };

    this.init = async () => {
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
            this.currentCategory);
        render();
        initEventListeners();
    };
    
    const render = async () => {
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        const template = this.menu[this.currentCategory]
        .map((menuItem) => {
            return `  
            <li data-menu-id="${menuItem.id}" class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name ${menuItem.isSoldOut?"sold-out":""}">${menuItem.name}</span>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                >
                품절
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
            >
                수정
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
            >
                삭제
            </button>
            </li>
            `;
            })
            .join("");
            
        $("#menu-list").innerHTML = template;
        updateMenuCount();
    };

    const updateMenuCount = () => {
        const menuCount = this.menu[this.currentCategory].length;
        $(".menu-count").innerText = `총 ${menuCount}개`;  
    };

    const addMenuName = async () => {
        if($('#menu-name').value === "") {
            alert("값을 입력해주세요.");
            return;
        }  
        const duplicatedItem = this.menu[this.currentCategory].find(menuItem => menuItem.name === $('#menu-name').value)
        if(duplicatedItem) {
            alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
            $('#menu-name').value = ""; 
            return;
        }

        const menuName = $('#menu-name').value;
        await MenuApi.createMenu( this.currentCategory,menuName);
        render();
        $('#menu-name').value = "";   
    };

    const updateMenuName = async (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const updateMenuName = prompt(
            "메뉴명을 수정하세요",
        $menuName.innerText);
        await MenuApi.updateMenu(this.currentCategory, updateMenuName, menuId);
        render();
    };

    const removeMenuName = async (e) => {
        const deleteMenuName = confirm("정말 삭제하시겠습니까?");
        
        if(deleteMenuName){
            const menuId = e.target.closest("li").dataset.menuId;
            await MenuApi.deleteMenu(this.currentCategory, menuId);
            render();
        }
    };

    const soldOutMenu = async (e) => {
        const menuId = e.target.closest("li").dataset.menuId;    
        await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        render();
    };

    const changeCategory = (e) => {
        const isCategoryBtn = e.target.classList.contains("cafe-category-name");
        if (isCategoryBtn) {
            const categoryName = e.target.dataset.categoryName;
            // console.log(categoryName);
            this.currentCategory = categoryName;
            $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
            render();
        }
    };

    const initEventListeners = () => {
        $("#menu-list").addEventListener("click", (e) => {
            if(e.target.classList.contains("menu-edit-button")) {
                updateMenuName(e);
                return;
            }
            else if(e.target.classList.contains("menu-remove-button")) {
                removeMenuName(e);
                return;
            }
            else if(e.target.classList.contains("menu-sold-out-button")) {
                soldOutMenu(e);
                return;
            }
        });
        
        $("#menu-form").addEventListener("submit", (e) => {
            e.preventDefault();
        });
    
        $('#menu-submit-button').addEventListener('click',addMenuName);
    
        $('#menu-name').addEventListener("keypress", (event) => {
            if(event.key !=="Enter") {
                return;
            };
            if(event.key =="Enter"){
                addMenuName();
            };
        });
    
        $("nav").addEventListener("click", (e) => {
            changeCategory(e);
        });
    };
}

const app = new App();
app.init();
