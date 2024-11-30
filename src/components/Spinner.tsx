interface Props{
  color?: string,
  content?: string
}
export default function Spinner({color, content}: Props) {
  if(!color) color = '#fff'
  return (<>
    <div className="lds-ripple">
      <div style={{borderColor: color}}/>
      <div style={{borderColor: color}}/>
    </div>
    {
      content?
        <div className="mt-1">{content}</div>
      :
        null
    }
  </>)
}