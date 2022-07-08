export const IntroText = ({ origin, destination }: { origin: string; destination: string }) => (
  <p className="mb-4">
    Upcoming trains from {origin} to {destination}, sorted by arrival time:
  </p>
)
