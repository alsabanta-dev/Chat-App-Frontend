import MessageModel from "../interfaces/MessageModel"
import { downloadFile, formatFileName, formatFileSize } from "../utils/utils";

export default function Message({message, dir, date, file, type}: MessageModel){

  const formatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });
  const formattedTime = formatter.format(date);
  return (
    <div className={`message-${dir}`} style={{overflowX: 'hidden', wordBreak: 'break-word'}}>
      <div className="message p-2 mb-1 rounded-7">
        {
          type != 'text'?
            type == 'image'?
              <img role="button" src={`http://127.0.0.1:3000/storage/conversations/images/${file}`} style={{maxHeight: '250px', borderRadius: '.5rem'}}/>
            :
              type == 'video'?
                (
                  // TODO: Set video thumbnail
                  <div className='d-flex align-items-center justify-content-center' style={{position: 'relative'}}>
                    <video src={`http://127.0.0.1:3000/storage/conversations/videos/${file}`} style={{maxHeight: '250px', borderRadius: '.5rem'}}/>
                    <div role="button" className='d-flex align-items-center justify-content-center' style={{position: 'absolute', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', width: '50px', height: '50px'}}>
                      <i className="fa fa-play fa-lg text-white"/>
                    </div>
                  </div>
                )
              :
                type == 'document'?
                  (
                    // TODO: Get size of the file and download it when click
                    <div className="d-flex align-items-center gap-2 px-2 py-1 message-file">
                      <i className="fa fa-file fa-2x"/>
                      <div className="d-flex flex-column">
                        <div className="small">{file}</div>
                        <div className="smaller">{formatFileSize(500*1024)} ● {file!.substr(file!.lastIndexOf('.')+1).toUpperCase()}</div>
                      </div>
                      <div role='button' className="download-button ms-1" onClick={() => downloadFile(`http://127.0.0.1:3000/storage/conversations/documents/${file}`, file)}>
                        <i className="fa fa-download fa-xs"/>
                      </div>
                    </div>
                  )
                :
                  null
          :
            null
        }
        <div className="small" >
          {message}
        </div>
        <div className='align-item-center float-end float-bottom'>
          <div className="small date ms-1 me-1">{formattedTime} <i className="fa fa-check fa-2xs" aria-hidden="true"/></div>
        </div>
      </div>
    </div>
  )
}