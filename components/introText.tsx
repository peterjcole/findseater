export const IntroText = ({
  origin,
  destination,
  date,
}: {
  origin: string
  destination: string
  date: string
}) => (
  <p className="mb-4">
    Upcoming trains from {origin} to {destination}, on {date}, sorted by arrival time:
  </p>
)
