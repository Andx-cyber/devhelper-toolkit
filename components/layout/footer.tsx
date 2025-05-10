export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with ❤️ by developers for developers.
          <a
            href="https://github.com/Andx-cyber"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 ml-1"
          >
            GitHub
          </a>
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} DevHelper. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
