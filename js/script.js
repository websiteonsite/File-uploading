const dropArea = document.querySelector('.drop-section')
const listSection = document.querySelector('.list-section')
const listContainer = document.querySelector('.list')
const fileSelector = document.querySelector('.file-selector')
const fileSelectorInput = document.querySelector('file-selector-input')

//upload files with browse button
fileSelector.onclick = () => fileSelectorInput.click()
fileSelectorInput.onchange = () => {
    [...fileSelectorInput.files].forEach(() => {
        if(typeValidation(file.type)){
            console.log(file);
        }
    })
}
//when file over the drag area
dropArea.ondragover = (e) => {
    [...e.dataTransfer.items].forEach((item) => {
        if(typeValidation(item.type)){
            dropArea.classList.add('drag-over-effect')
        }
    })
}


//when file leave the drag area
dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect')
}

//when file drop on the drag area
dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over-effect')
    if(e.dataTransfer.items){
        [...e.dataTransfer.items].forEach((item) => {
            if(item.kind === 'file'){
                const file = item.getAsFile();
                if(typeValidation(file.type)){
                    uploadFile(file)
                }
            }
        })
        } else{
            [...e.dataTransfer.files].forEach((file) => {
                if(typeValidation(file.type)){
                    uploadFile(file)
                }
            })
    }
}
        
//check the file type
function typeValidation(type){
    var splitType = type.split('/')[0]
    if(type == 'application/pdf' || splitType == 'image' || splitType== 'video'){
        return true
    }
}

//upload file function
function uploadFile(file){
    //do uploading
    listSection.computedStyleMap.display = 'block'
    var li = document.createElement('li')
    li.classList.add('in-prog')
    li.innerHTML = `
                        <div class="col">
                            <img src="icons/${iconSelector(file.type)}" alt="">
                        </div>
                        <div class="col">
                        <div class="file-name">
                            <div class="name">${file.name}</div>
                            <span>0%</span>
                        </div>
                        <div class="file-progress">
                            <span></span>
                        </div>
                        <div class="file-size">${(file.size/(1024*1024)).toFixed(2)}</div>
                        <div class="col">
                            <!-- from google icons-->
                            <!-- <span class="material-symbols-outlined">
                                check
                                </span>
                            <span class="material-symbols-outlined">
                                    close
                                    </span>     -->
                                    <svg xmlns="http://www.w3.org/2000/svg" class="tick" height:"20" width:"20" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="cross" width:"20" height:"20" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                                    
                        </div>
    `
    listContainer.prepend(li)
    var http = new XMLHttpRequest()
    var data = new FormData()
    data.append('file', file)
    http.onload = () => {
        //completed
        li.classList.add('complete')
        li.classList.remove('in-prog')
    }
    http.upload.onprogress = (e) => {
        var percent_complete = (e.loaded / e.total)*100
       // console.log(percent_complete);
        li.querySelector('span')[0].innerHTML = Math.round(percent_complete) +'%'
        li.querySelector('span')[0].style.width = percent_complete + '%'
    }
    http.open('POST','sender.php', true)
    http.send(data)
    li.querySelector('.cross').onclick = () => http.abort()
    http.onabort = () => li.remove()
}

//find icon for file
function iconSelector(type){
    var splitType = (type.split('/')[0] == 'application') ? type.split('/')[1] : type.split('/')[0]
        return splitType +'.png'
    }
