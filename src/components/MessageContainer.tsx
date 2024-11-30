import Spinner from './Spinner'

interface Props {
  state: string,
  mainContent: string,
  notFoundContent: string
  image: string | null,
  notFoundImage: string | null
}

export default function MessageContainer({ state, mainContent, notFoundContent, image, notFoundImage }: Props){
  if(state == 'holder')
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100%'}}>
        {image? <img src={image} style={{width: '45px'}}/> : null}
        <div className="mt-1">{mainContent}</div>
      </div>
    )
  
  if(state == 'loading') {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100%'}}>
        <Spinner color='rgb(13, 110, 253)'/>
        <div className="mt-1">Loading...</div>
      </div>
    )
  }

  if(state == 'notFound'){
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100%'}}>
        {notFoundImage? <img src={notFoundImage} style={{width: '45px'}}/> : null}
        <div className="mt-1">{notFoundContent}</div>
      </div>
    )
  }
  
}