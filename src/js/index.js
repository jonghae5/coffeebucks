// TODO localStorage Read & Write
// - [X] localStorage 에 데이터를 저장한다. 
// - [X] 메뉴를 추가할 때 
// - [X] 메뉴를 수정할 때 
// - [X] 메뉴를 삭제할 때 
// - [X] localStorage 에 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [X] 에스프레소
// - [X] 프라푸치노
// - [X] 블렌디드
// - [X] 티바나
// - [X] 디저트

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [X] 페이지에 최초 로딩시 LocalStorage에 에스프레소 데이터를 읽어온다.
// - [X] 메뉴를 페이지에 나타낸다.

// TODO 품절 상태 관리
// - [X] 품절 버튼 추가
// - [X] 품절 버튼 클릭시 LocalStorage에 상태값이 저장
// - [X] 품절 해당 메뉴의 상태값이 페이지에 그려진다. (`sold out` class)

import {$} from "./utils/dom.js"
import storage from "./storage/index.js"

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
    this.init = () => {
        if(storage.getLocalStorage()) {
            this.menu = storage.getLocalStorage();
            // console.log(this.menu);
        }
        render();
        initEventListeners();
    };
    
    const render = () => {
        const template = this.menu[this.currentCategory]
        .map((menuItem, index) => {
            return `  
            <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name ${menuItem.soldOut?"sold-out":""}">${menuItem.name}</span>
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
        // const menuCount = $('#menu-list')
        // .querySelectorAll("li")
        // .length;
        const menuCount = this.menu[this.currentCategory].length;
        $(".menu-count").innerText = `총 ${menuCount}개`;  
    };

    const addMenuName = () => {
        if($('#menu-name').value === "") {
            alert("값을 입력해주세요.");
            return;
        }  
        const menuName = $('#menu-name').value;
        this.menu[this.currentCategory].push({name : menuName});
        storage.setLocalStorage(this.menu);
        render();
        $('#menu-name').value = "";
        
    };

    const updateMenuName = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const updateMenuName = prompt(
            "메뉴명을 수정하세요",
        $menuName.innerText);
        this.menu[this.currentCategory][menuId].name = updateMenuName;
        storage.setLocalStorage(this.menu);
        // $menuName.innerText = updateMenuName;
        render();
    };

    const removeMenuName = (e) => {
        const deleteMenuName = confirm("정말 삭제하시겠습니까?");
        if(deleteMenuName){
            const menuId = e.target.closest("li").dataset.menuId;
            this.menu[this.currentCategory].splice(menuId, 1);
            storage.setLocalStorage(this.menu);
            render();
        }
    };

    const soldOutMenu = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;    
        this.menu[this.currentCategory][menuId].soldOut = 
        !this.menu[this.currentCategory][menuId].soldOut;
        storage.setLocalStorage(this.menu);
        render();
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
    
        $("nav").addEventListener("click",(e) => {
            const isCategoryBtn = e.target.classList.contains("cafe-category-name");
            if (isCategoryBtn) {
                const categoryName = e.target.dataset.categoryName;
                // console.log(categoryName);
                this.currentCategory = categoryName;
                $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
                render();
            }
        });
    };
}

const app = new App();
app.init();
