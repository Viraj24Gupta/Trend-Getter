const modal = document.querySelector(".modal");
const previews = document.querySelectorAll(".container .myImg");
const orignal = document.querySelector(".full-image");

previews.forEach(preview => {
	preview.addEventListener('click',() => {
		modal.classList.add("open");
		orignal.classList.add("open");
		const orignalSrc = preview.getAttribute("data-original");
		orignal.src = `../assets/images/${orignalSrc}`;
	});
});

modal.addEventListener('click',(e)=>{
	if(e.target.classList.contains('modal')){
		modal.classList.remove("open");
		orignal.classList.remove("open");
	}
});
