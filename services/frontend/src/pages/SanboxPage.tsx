import { ProgressBar } from '../components/ProgressBar/ProgressBar'

export const SanboxPage = () => {
  return (
    <>
      <div
        style={{
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '600px',
        }}
      >
        <ProgressBar />
      </div>
    </>
  )
}
