import MapSlider from '@/components/map-slider'
import BarSlider from '@/components/bar-slider'
import styles from './styles.module.css'

export default function Home() {
  const title = 'Parking Spaces of the City of Zurich'

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-2 md:pt-4 lg:p-2">
      <div className="relative flex place-items-center flex-col w-full">
        <div className={styles.title}>
          <h1 className="mb-3 text-3xl md:text-4xl font-semibold text-center">{title}</h1>
        </div>
        <div className={`${styles.fadeIn} w-full`}>
          <div className={styles.visualizationOuterWrapper}>
            <div className={`${styles.visualizationInnerWrapper} flex flex-col md:flex-row`}>
              <div className='w-full p-4'>
                <div className='md:p-16'>
                  <h3 className={styles.titleH3}>&quot;Parkplatzkompromiss&quot; - The Historical Compromise of 1996</h3>
                  In 1996 the municipal council adopted a compromis for Zurich City and areas close to the centre.
                  It essentially consists of making the city centre more attractive for pedestrian traffic by shifting surface parking spaces to parking facilities,
                  but without affecting the total number of publicly accessible parking spaces. The municipal council defined the 1990 level as the starting point.
                  The number of parking spaces in the city centre should remain stable at this level.
                  <br />
                  <br />
                  After 25 years it has come to an end. Here we compare the amount of parking spaces of cars to the parking spaces the city provides for bikes of any kind.
                  We visualize how public car parking spaces have been moved, removed or replaced by parking spaces for bicycles or motorcycles over time.
                </div>
              </div>
            </div>
          </div>
          <div className={styles.visualizationOuterWrapper}>
            <div className={`${styles.visualizationInnerWrapper} flex flex-col md:flex-row`}>
              <div className='p-4 w-full md:w-1/2'>
                <MapSlider />
              </div>
              <div className='p-4 w-full md:w-1/2'>
                Zurich, the largest city in Switzerland, is strategically located in the central part of the country. The city is nestled in the northeastern Swiss lowlands, along the lower end of Lake Zurich, and is roughly an hour&apos;s drive from the Alpine landscapes to the south. This prime location, combined with the citys excellent transportation network, makes Zurich easily accessible from all corners of Switzerland and beyond.
                <br />
                <br />
                As for the parking situation, like many other bustling cities, parking in Zurich can be challenging. The city centre is known for its limited parking spaces and the relatively high costs of parking garages. On-street parking is usually metered and is most often limited to a few hours. For longer stays, it&apos;s typically more cost-effective and convenient to use one of the city&apos;s Park & Ride facilities, located near public transportation hubs.
                <br />
                <br />
                In recent years, Zurich, like many urban areas worldwide, has seen a surge in the popularity of bicycles as a mode of transport. The city has responded by investing in cycling infrastructure, including dedicated bike lanes and bicycle parking facilities, to encourage this eco-friendly mode of transport. The rise in cycling popularity is in line with Zurich&apos;s commitment to sustainable and active mobility, and it contributes to the city&apos;s vision of reducing carbon emissions and promoting healthier lifestyles.
              </div>
            </div>
          </div>
          <div className={styles.visualizationOuterWrapper}>
            <div className={`${styles.visualizationInnerWrapper} flex flex-col md:flex-row`}>
              <div className='p-4 w-full md:w-1/2'>
                This population pyramid-inspired graph displays the amount of parking spaces for cars (in green) and parking spaces for two-wheelers (in blue).
                We interpolated the data as we do not have as much data for the parking spaces for bikes and each data collection took place in odd years.
                This explains why before 2015 there is a constant amount of bikes, namely 3000 for every district.
              </div>
              <div className='p-4 w-full md:w-1/2'>
                <BarSlider />
              </div>
            </div>
          </div>
          <div className={styles.visualizationOuterWrapper}>
            <div className={`${styles.visualizationInnerWrapper} flex flex-col md:flex-row`}>
              <div className='w-full p-4'>
                <div className={`text-center md:p-16`}>
                  COM-480 Data Visualization, 2023
                  <hr />
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