const dateFormat = (date: number): string => {
  const currentDate = new Date()
  const currentDateFull = `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`
  const mDate = new Date(date)
  const mDateFull = `${mDate.getDay()}/${mDate.getMonth()}/${mDate.getFullYear()}`
  const day = `${mDate.getDate()}`
  const month = mDate.getMonth()
  const year = mDate.getFullYear()
  let hours = mDate.getHours()
  let minutes = mDate.getMinutes()
  let diem = 'AM'

  if(currentDate.getTime() - mDate.getTime() <= 2*60*60){
    return 'Just now'
  }else{
    const dayDiff = Math.floor((currentDate.getTime() - mDate.getTime())/(24*60*60*1000))
  
    if(dayDiff == 0 && currentDateFull == mDateFull){
      if(hours == 0) hours = 12
      if(hours > 12) {
        hours -= 12
        diem = 'PM'
      }
      if(hours < 10){
        hours = '0' + hours
      }
      if(minutes < 10) minutes = '0' + minutes
      return `${hours}:${minutes} ${diem}`
    }else if(dayDiff == 1 || (dayDiff == 0 && currentDateFull != mDateFull)){
      return 'Yesterday'
    }else{
      return `${month+1}/${day}/${year.toString().slice(2)}`
    }
  }

}

const formatFileName = (fileName: string): string => {
  const length = 22
  const halfLength = Math.ceil(length/2)
  if(fileName.length > length) {
    return fileName.substr(0, halfLength) + '...' + fileName.substr(-halfLength)
  }
  return fileName
}

const formatFileSize = (sizeInBytes: number): string => {
  if(sizeInBytes < 1024){
    return `${sizeInBytes} B`
  }else {
    const kb = sizeInBytes/1024
    if(kb < 1024){
      return `${isInt(kb)?kb:kb.toFixed(2)} KB`
    }else{
      const mb = kb/1024
      if(mb<1024){
        return `${isInt(mb)?mb:mb.toFixed(2)} MB`
      }else{
        const gb = mb/1024
        return `${isInt(gb)?gb:gb.toFixed(2)} GB`
      }
    }
  }
}

const isInt = (n: number): boolean => {
  return n % 1 === 0
}

const generateVideoThumbnail = (file: File) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const video = document.createElement("video")

    // this is important
    video.autoplay = true
    video.muted = true
    video.src = URL.createObjectURL(file)

    video.onloadeddata = () => {
      const canvasContext = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      video.pause()
      return resolve(canvas.toDataURL("image/png"))
    }
  })
}

function downloadFile(url:string, fileName:string) {
  fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
    .then(res => res.blob())
    .then(res => {
      const aElement = document.createElement('a');
      aElement.setAttribute('download', fileName);
      const href = URL.createObjectURL(res);
      aElement.href = href;
      aElement.setAttribute('target', '_blank');
      aElement.click();
      URL.revokeObjectURL(href);
    });
};

export {dateFormat, formatFileName, formatFileSize, generateVideoThumbnail, downloadFile}