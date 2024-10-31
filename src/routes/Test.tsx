import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

export default function Test() {
  return (
    <div className="p-8 space-y-8 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Sonner Toast Examples</h1>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Toasts</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => toast("Default toast")}>Default</Button>
          <Button onClick={() => toast.success("Success toast")}>
            Success
          </Button>
          <Button onClick={() => toast.error("Error toast")}>Error</Button>
          <Button onClick={() => toast.info("Info toast")}>Info</Button>
          <Button onClick={() => toast.warning("Warning toast")}>
            Warning
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Content</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              toast("Toast with action", {
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }
          >
            With Action
          </Button>
          <Button
            onClick={() =>
              toast(
                <div className="flex items-center gap-2">
                  <span className="font-bold">Custom JSX</span>
                  <span role="img" aria-label="rocket">
                    🚀
                  </span>
                </div>
              )
            }
          >
            Custom JSX
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Positioning</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => toast("Top Left", { position: "top-left" })}>
            Top Left
          </Button>
          <Button
            onClick={() => toast("Top Center", { position: "top-center" })}
          >
            Top Center
          </Button>
          <Button onClick={() => toast("Top Right", { position: "top-right" })}>
            Top Right
          </Button>
          <Button
            onClick={() => toast("Bottom Left", { position: "bottom-left" })}
          >
            Bottom Left
          </Button>
          <Button
            onClick={() =>
              toast("Bottom Center", { position: "bottom-center" })
            }
          >
            Bottom Center
          </Button>
          <Button
            onClick={() => toast("Bottom Right", { position: "bottom-right" })}
          >
            Bottom Right
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Duration and Dismissible</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => toast("5 seconds", { duration: 5000 })}>
            5 Seconds
          </Button>
          <Button
            onClick={() => toast("Not dismissible", { dismissible: false })}
          >
            Not Dismissible
          </Button>
          <Button
            onClick={() => toast("Infinite duration", { duration: Infinity })}
          >
            Infinite
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Styling</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              toast("Custom style", {
                style: { background: "red", color: "white" },
              })
            }
          >
            Custom Style
          </Button>
          <Button
            onClick={() =>
              toast("Custom class", {
                className: "my-custom-toast",
              })
            }
          >
            Custom Class
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Advanced Features</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => {
              const toastId = toast.loading("Loading...", {
                dismissible: false,
                className: "text-lg",
                action: {
                  label: <XIcon className="absolute right-3 h-5 w-5" />,
                  onClick: () => {},
                },
              })

              toast.success("Loaded!", {
                id: toastId,
                classNames: {
                  actionButton: "!bg-transparent",
                },
                action: {
                  label: (
                    <XIcon className="absolute right-3 h-5 w-5 text-white" />
                  ),
                  onClick: () => {},
                  actionButtonStyle: {
                    backgroundColor: "red !important",
                  },
                },
              })
            }}
          >
            Loading to Success
          </Button>
          <Button
            onClick={() =>
              toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                loading: "Loading...",
                success: "Promise resolved!",
                error: "Promise rejected!",
              })
            }
          >
            Promise Toast
          </Button>
          <Button
            onClick={() => {
              const toastId = toast("Updating toast")
              setTimeout(() => {
                toast("Updated toast", { id: toastId })
              }, 2000)
            }}
          >
            Update Existing Toast
          </Button>
        </div>
      </div>

      {/* Toaster component with all available props */}
      <Toaster richColors />
      {/* <Toaster
        // expand={false}
        visibleToasts={6}
        closeButton
        richColors
        theme="dark"
        duration={2000}
        position="top-center"
        hotkey={["altKey", "KeyT"]}
        toastOptions={{
          className: "my-toast-class",
          descriptionClassName: "my-toast-description-class",
          // style: {
          //   background: "var(--background)",
          //   color: "var(--foreground)",
          // },
        }}
      /> */}
    </div>
  )
}
