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
        <div className={`${styles.fadeIn} w-full`}>
          <div className={styles.visualizationOuterWrapper}>
            <div className={styles.visualizationInnerWrapper}>
              <div className={styles.visualizationItem}>
                <MapSlider />
              </div>
              <div className={styles.visualizationItem}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
                magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
              </div>
            </div>
          </div>
          <div className={styles.separator} />
          <div className={styles.visualizationOuterWrapper}>
            <div className={styles.visualizationInnerWrapper}>

              <div className={styles.visualizationItem}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
                magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
              </div>
              <div className={styles.visualizationItem}>
                <BarSlider />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}