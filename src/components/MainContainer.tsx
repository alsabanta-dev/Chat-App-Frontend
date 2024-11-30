interface Props {
  content: React.ReactComponentElement<any, Any>
}

export default function MainContainer({content}: Props) {
  return content
}