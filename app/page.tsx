import MapSlider from '@/components/map-slider'
import BarSlider from '@/components/bar-slider'
import styles from './styles.module.css'

export default function Home() {
  const title = 'Zurich Parking Spaces'

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-2 md:pt-4 lg:p-2">
      <div className="relative flex place-items-center flex-col w-full">
        <div className="title">
          <h1 className="mb-3 text-3xl md:text-4xl font-semibold text-center">{title}</h1>
        </div>
        <div className={`${styles.fadeIn} w-full md:w-4/6 lg:w-3/6`}>
          <MapSlider />
          <div className={styles.separator} />
          <BarSlider />
        </div>
      </div>
    </main>
  )
}