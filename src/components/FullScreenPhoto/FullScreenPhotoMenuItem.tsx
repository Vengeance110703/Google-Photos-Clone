import { DropdownMenuItem } from "../ui/dropdown-menu"

type Props = {
  onClick: () => void
  text: string
}

const FullScreenPhotoMenuItem = ({ onClick, text }: Props) => {
  return <DropdownMenuItem onClick={onClick}>{text}</DropdownMenuItem>
}

export default FullScreenPhotoMenuItem
