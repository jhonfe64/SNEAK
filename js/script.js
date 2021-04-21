const menuBtn = document.querySelector("#menuBtn");
const mobileMenu = document.querySelector("#mobileMenu");
const deskpotMenu = document.querySelector("#deskpotMenu");
const menuItem = document.querySelectorAll(".menuItem");
const selection_item = document.querySelectorAll(".selection_item");
const results_container = document.querySelector("#results_container");
const header = document.querySelector("#header");
const jumbo = document.querySelector("#jumbo");
const list_view = document.querySelector("#list_view");
const grid_view = document.querySelector("#grid_view");
const top_menu_item = document.querySelectorAll(".top_menu_item");
const top_menu_item_link = document.querySelectorAll('.top_menu_item_link');


/*================================================ 
Menu
==================================================*/

const headerHeight = header.clientHeight;
jumbo.style.marginTop = `${headerHeight}px`

//Mobile Menu
menuBtn.addEventListener("click", ()=>{
    mobileMenu.classList.toggle("showMenu");
    mobileMenu.style.transition=".5s";
});

//desktop menu
for(i=0; i<menuItem.length; i++){
    menuItem[i].addEventListener('mouseover', function(){
        this.firstElementChild.style.color = "#ffffff";
    });
    menuItem[i].addEventListener('mouseout', function(){
        this.firstElementChild.style.color = "#707070";
    });

    menuItem[i].addEventListener('click', function(){
        for(i=0; i<menuItem.length; i++){
            menuItem[i].children[0].classList.remove("menu_color");
        }
        this.children[0].classList.add("menu_color");
    });
}

/*================================================ 
Selection_item && menu items
==================================================*/

const selectionItemArray = Array.from(selection_item);

selectionItemArray.map((single_item)=>{
    single_item.addEventListener('click', function(){
        results_container.innerHTML= "";
        selectionItemArray.map((single_item)=>{
            single_item.classList.remove('select_item');
        });

        this.classList.add('select_item');
    })
})

//menu btns
const top_menu_itemArray = Array.from(top_menu_item);
top_menu_itemArray.map((menu_btn)=>{
    menu_btn.addEventListener('click', function(){
        results_container.innerHTML= "";
        top_menu_itemArray.map((menu_btn)=>{
            menu_btn.classList.remove('select_item');
        })
        this.classList.add('select_item');
    });
    
});

/*================================================ 
searching Results showing when clicking
==================================================*/

const searchingBtns = Array.from(selection_item);
//verify local storage when loading
const localStorageListView = localStorage.getItem("listViews");

//Getting the value of buttons
searchingBtns.map((btn)=>{
    btn.addEventListener('click', function(){
        searchingValue(this.getAttribute('value'));
        top_menu_itemArray.map((menu_btn)=>{
            menu_btn.classList.remove('select_item');
            menu_btn.children[0].classList.remove('menu_color')
        });
    });
});

//Getting the value of  mneu btns
top_menu_itemArray.map((btn_menu)=>{
    btn_menu.addEventListener('click', function(){
        searchingValue(this.getAttribute('value'));
        searchingBtns.map((menu_btn)=>{
            menu_btn.classList.remove('select_item');
        })
    });
});

const searchingValue = async (searchingValue) => {
    const getItems = await fetch('../data.json');
    const json = await getItems.json();
    const infoArray = json.data;
    console.log(typeof infoArray);
    //filtering by btn value
    infoArray.map((single_data)=>{
        if(single_data.category === searchingValue){
            renderingInfo(single_data);
        }else if(searchingValue === "All"){
            renderingInfo(single_data);
        }
    });
}

//Handling views by grid or list
const gridOrListView = (newItem) => {
    list_view.addEventListener('click', ()=>{
        localStorage.setItem("listViews", true);
    })

    list_view.addEventListener('click', ()=>{
        newItem.classList.add("w-100")
    });

    grid_view.addEventListener('click', ()=>{
        newItem.classList.remove("w-100");
        localStorage.removeItem('listViews');
        newItem.classList.remove('w-100');
        //responsive 
        responsiveImages(newItem);
    })
}

//Responsive Images function
const responsiveImages = (newItem) => {
    const localStorageListView = localStorage.getItem("listViews");
    if((window.matchMedia("(max-width: 768px)").matches) && localStorageListView === null){
        newItem.classList.add('w-100')
    }
    if((window.matchMedia("(min-width: 769px)").matches) && localStorageListView === null){
        newItem.classList.remove('w-100')
    }
    
}

//Rendering information
const renderingInfo = (single_data) => {
    const newItem = document.createElement('div');
    newItem.setAttribute("class", "img_container_results");
    //grid or list view according to the local storage
    gridOrListView(newItem);
    newItem.innerHTML = `
        <img src=${single_data.image}>
        <div class="hide_details">
            <div>
                <h3>${single_data.title}</h3>
                <p>${single_data.description}</p>
            </div>
        </div>
        `
    results_container.appendChild(newItem);
    //responsive
    window.addEventListener('resize', ()=>{
        responsiveImages(newItem);
    });
    responsiveImages(newItem);
    //Verify local storage 
    const localStorageListView = localStorage.getItem("listViews");
    if(localStorageListView){
        newItem.classList.add("w-100");
    }
    //hover effect
    const imagesHoverEffect = document.getElementsByClassName("img_container_results");
    hoverEffect(imagesHoverEffect);
}

//Handling with hover effect
const hoverEffect = (imagesHoverEffect) => {
    const imagesHoverEffectArray = Array.from(imagesHoverEffect);
    for(i=0; i<imagesHoverEffectArray.length; i++){
        imagesHoverEffectArray[i].addEventListener("mouseover", function(){
        this.children[1].classList.add('d-block');
        });
        imagesHoverEffectArray[i].addEventListener("mouseleave", function(){
            this.children[1].classList.remove('d-block');
        });
    }
}

/*================================================ 
getting Results when loading page
==================================================*/

window.addEventListener('load', async ()=>{
    const getItems = await fetch('../data.json');
    const json = await getItems.json();
    const infoArray = json.data;

    infoArray.map((single_data)=>{
        const newElement = document.createElement('div');
        newElement.setAttribute("class", "img_container_results");
        newElement.innerHTML = `
            <img src=${single_data.image}>
            <div class="hide_details">
                <div>
                    <h3>${single_data.title}</h3>
                    <p>${single_data.description}</p>
                </div>
            </div>
        `
        results_container.appendChild(newElement);
        //Responsive
        window.addEventListener('resize', ()=>{
            responsiveImages(newElement);
        });
        responsiveImages(newElement);
        if(localStorageListView){
            newElement.classList.add("w-100")
        }
        gridOrListView(newElement);
        //hover efefct
        const imagesHoverEffect = document.getElementsByClassName("img_container_results");
        hoverEffect(imagesHoverEffect);
    });
});

//Scrolling effect
window.addEventListener('scroll', ()=>{
    const scrollYvalue = window.scrollY;
    const jumboHeight = jumbo.clientHeight;
    if(scrollYvalue >= jumboHeight){
        header.classList.add('scroll_effect');
        header.style.transition = ".2s"
    }else{
        header.classList.remove('scroll_effect');
        header.style.transition = ".2s"
    }
});

//scroll behavior
for(link of top_menu_item_link){
    link.addEventListener("click", function(e){
        e.preventDefault()
        const href = this.getAttribute("href");
        const offsetTop = document.querySelector(href).offsetTop -300;
        scroll({
            top: offsetTop,
            behavior: "smooth"
          });
    })
}






