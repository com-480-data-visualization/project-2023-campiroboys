import MapSlider from '@/components/map-slider'
import BarSlider from '@/components/bar-slider'
import styles from './styles.module.css'

export default function Home() {
  const title = 'Zurich Parking Spaces'

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-2 md:pt-4 lg:p-2">
      <div className="relative flex place-items-center flex-col w-full">
        <div className={styles.title}>
          <h1 className="mb-3 text-3xl md:text-4xl font-semibold text-center">{title}</h1>
        </div>
        <div className={`${styles.fadeIn} w-full`}>
          <div className={styles.visualizationOuterWrapper}>
            <div className={styles.visualizationInnerWrapper}>
              <div className={styles.visualizationItem100}>
                <div className={styles.infoText}>
                  <h3 className={styles.titleH3}>&quot;Parkplatzkompromiss&quot; - The Historical Compromise of 1996</h3>
                  In 1996 the municipal council adopted a compromis for Zurich City and areas close to the centre.
                  It essentially consists of making the city centre more attractive for pedestrian traffic by shifting surface parking spaces to parking facilities,
                  but without affecting the total number of publicly accessible parking spaces. The municipal council defined the 1990 level as the starting point.
                  The number of parking spaces in the city centre should remain stable at this level.
                  <br/>
                  <br/>
                  After 25 years it has come to an end. Here we compare the amount of parking spaces of cars to the parking spaces the city provides for bikes of any kind.
                  We visualize how public car parking spaces have been moved, removed or replaced by parking spaces for bicycles or motorcycles over time.
                </div>
              </div>
            </div>
          </div>
          <div className={styles.visualizationOuterWrapper}>
            <div className={styles.visualizationInnerWrapper}>
              <div className={styles.visualizationItem50}>
                <MapSlider />
              </div>
              <div className={styles.visualizationItem50}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
                magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
              </div>
            </div>
          </div>
          <div className={styles.visualizationOuterWrapper}>
            <div className={styles.visualizationInnerWrapper}>

              <div className={styles.visualizationItem50}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
                magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
              </div>
              <div className={styles.visualizationItem50}>
                <BarSlider />
              </div>
            </div>
          </div>
          <div className={styles.visualizationOuterWrapper}>
            <div className={styles.visualizationInnerWrapper}>

              <div className={styles.visualizationItem100}>
                <div className={styles.infoText} style={{textAlign: "center"}}>
                  COM-480 Data Visualization, 2023
                  <hr/>
                  Damiano Amatruda, Josua Stuck, Silas Meier

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}