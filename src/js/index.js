// TODO localStorage Read & Write
// - [X] localStorage 에 데이터를 저장한다. 
// - [X] 메뉴를 추가할 때 
// - [X] 메뉴를 수정할 때 
// - [X] 메뉴를 삭제할 때 
// - [X] localStorage 에 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [ ] 에스프레소
// - [ ] 프라푸치노
// - [ ] 블렌디드
// - [ ] 티바나
// - [ ] 디저트

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [ ] 페이지에 최초 로딩시 LocalStorage에 에스프레소 데이터를 읽어온다.
// - [ ] 에스프레소 메뉴를 페이지에 나타낸다.

// TODO 품절 상태 관리
// - [ ] 품절 버튼 추가
// - [ ] 품절 버튼 클릭시 LocalStorage에 상태값이 저장
// - [ ] 품절 해당 메뉴의 상태값이 페이지에 그려진다. (`sold out` class)


const $ = (selector) => document.querySelector(selector);

const storage = {
    setLocalStorage(menu){
        localStorage.setItem("menu",JSON.stringify(menu));
    },
    getLocalStorage(){
        return JSON.parse(localStorage.getItem("menu"));
    }
}


function App() {
    // 상태(변하는 데이터) - 메뉴명
    this.menu = [];
    this.init = () => {
        if(storage.getLocalStorage().length >0) {
            this.menu = storage.getLocalStorage();
            console.log(this.menu);
        }
        render();
    };
    
const render = () => {
    const template = this.menu.map((menuItem, index) => {
        return `  
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${menuItem.name}</span>
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
        
        $("#espresso-menu-list").innerHTML = template;
        updateMenuCount();
}

    const updateMenuCount = () => {
        const menuCount = $('#espresso-menu-list')
        .querySelectorAll("li")
        .length;
        $(".menu-count").innerText = `총 ${menuCount}개`;  
    }

    const addMenuName = () => {
        if($('#espresso-menu-name').value === "") {
            alert("값을 입력해주세요.");
            return;
        }  
        const espressoMenuName = $('#espresso-menu-name').value;
        this.menu.push({name : espressoMenuName});
        storage.setLocalStorage(this.menu);
        render();

        $('#espresso-menu-name').value = "";
        
    }

    const updateMenuName = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const updateMenuName = prompt(
            "메뉴명을 수정하세요",
        $menuName.innerText);
        this.menu[menuId].name = updateMenuName;
        storage.setLocalStorage(this.menu);
        $menuName.innerText = updateMenuName;
    }

    const removeMenuName = (e) => {
        const deleteMenuName = confirm("정말 삭제하시겠습니까?");
        if(deleteMenuName){
            const menuId = e.target.closest("li").dataset.menuId;
            this.menu.splice(menuId, 1);
            storage.setLocalStorage(this.menu);
            e.target
            .closest("li")
            .remove();
            updateMenuCount();
        }
    };


    $("#espresso-menu-list").addEventListener("click", (e) => {
        if(e.target.classList.contains("menu-edit-button")) {
            updateMenuName(e);
        }
        else if(e.target.classList.contains("menu-remove-button")) {
            removeMenuName(e);
        }
    });
    
    $("#espresso-menu-form").addEventListener("submit", (e) => {
        e.preventDefault();
    });

    $('#espresso-menu-submit-button').addEventListener('click',addMenuName);

    $('#espresso-menu-name').addEventListener("keypress", (event) => {
        if(event.key !=="Enter") {
            return;
        };
        if(event.key =="Enter"){
            addMenuName();
        };
    });
}

const app = new App();
app.init();
