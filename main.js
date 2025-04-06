const button = document.getElementById("button")
const input = document.getElementById('ip-address-input')


const handleClickButton = () =>{
    const address = input.value
    
    localStorage.setItem("address",address)
    window.location.href += "/htop"
}


button.addEventListener('click',handleClickButton)