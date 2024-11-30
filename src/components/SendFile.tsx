import React, { useState } from 'react'
import { formatFileName, formatFileSize, generateVideoThumbnail } from '../utils/utils'

interface Props {
  file: File | null,
  onFileCancel: () => void
}
export default function SendFile({file, onFileCancel}: Props) {
  const [fileSrc, setFileSrc] = useState('')
  let fileName = ''
  let fileSize = ''
  let fileType = ''
  let fileExt = ''
  let videoDuration = null
  const [videoThumbnail, setVideoThumbnail] = useState(null)
  let visibility = 'hidden'

  if(file){
    visibility = 'visible'
    fileName = formatFileName(file.name)
    fileSize = formatFileSize(file.size)
    fileExt = file.name.substr(file.name.lastIndexOf('.')+1)
    fileType = file.type.startsWith('image/')? 'image': file.type.startsWith('video/')? 'video': 'document'
    if(fileType == 'image'){
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if(e.target && e.target.result){
          setFileSrc(e.target.result.toString())
        }
      }
    }else if(fileType == 'video'){
      videoDuration = '01:30'
      generateVideoThumbnail(file).then(thumbnail => {
        setVideoThumbnail(thumbnail)
      })
    }
  }else{
    visibility = 'hidden'
  }

  return (
    <div className='d-flex flex-column align-items-center justify-content-center bg-accent divider-top' style={{visibility, height: '45%', width: '100%', borderRadius: '10px 10px 0px 0px', position: 'absolute', bottom: '10%'}}>
      <button className="btn btn-close ms-auto" title='Cancel' onClick={onFileCancel} style={{position: 'absolute', top: '0.5rem', right: '1rem'}}></button>
      <div className='d-flex flex-column align-items-center justify-content-center' style={{height: '100%', flexGrow: 1}}>
        {
          fileType == 'image'?
            <>
              <div className='d-flex align-items-center justify-content-center' style={{height: '85%'}}>
                <img src={fileSrc} className='bg-secondary' style={{height: '90%', objectFit: 'cover', borderRadius: '0.5rem'}}/>
              </div>
              <p className='small text-center' style={{height: '15%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip'}}>
                {fileName}<span className='text-muted mx-2'>●</span>{fileSize}
              </p>
            </>
          :
            fileType == 'video'?
              <>
                {/* TODO: Set video thumbnail and duration*/}
                <div className='d-flex align-items-center justify-content-center' style={{height: '85%'}}>
                  <img src={videoThumbnail} className='bg-secondary' style={{height: '90%', maxWidth: '90%',objectFit: 'cover', borderRadius: '0.5rem'}}/>
                  <div className='d-flex align-items-center justify-content-center' style={{position: 'absolute', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', width: '50px', height: '50px'}}>
                    {
                      videoThumbnail?
                        <i className="fa fa-play fa-lg text-white"/>
                      :
                        <div className="spinner-border" role='status'></div>
                    }
                  </div>
                  <div className='d-flex align-items-center justify-content-center smaller px-2' style={{position: 'absolute', borderRadius: '1rem', background: 'rgba(0,0,0,0.5)', top: '1rem', left: '1rem'}}>
                    {videoDuration}
                  </div>
                </div>
                <p className='small text-center' style={{height: '15%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip'}}>
                  {fileName}<span className='text-muted mx-2'>●</span>{fileSize}
                </p>
              </>
            :
              <>
                <i className="fa fa-file fa-3x mb-2"/>
                <div className='fw-bold'>{fileName}</div>
                <div className='small text-muted'>{fileExt.toUpperCase()}</div>
                <div className='small text-muted'>{fileSize}</div>
              </>
        }
      </div>
    </div>
  )
}
