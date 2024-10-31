import React from "react"
import * as lucide from "lucide-react"
import { Button } from "../ui/button"

type Props = {
  onClick: () => void
  iconName: string
  text: string
}

const NavbarButton = ({ onClick, iconName, text }: Props) => {
  const IconComponent = (
    lucide as unknown as Record<string, React.ComponentType<any>>
  )[iconName]

  return (
    <Button
      className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 hover:font-bold text-md"
      onClick={onClick}
    >
      <IconComponent className="mr-1 h-4 w-4" />
      {text}
    </Button>
  )
}

export default NavbarButton
