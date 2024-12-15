import {ResponsiveLine} from "@nivo/line"
import {linearGradientDef} from "@nivo/core"
import {useIsDarkMode} from "@/contexts/dark-contest"

export default function MyResponsiveLine({data}) {

    const isDarkMode = useIsDarkMode()
    console.log(isDarkMode)

    return (
        <div style={{height: '300px', width: '100%'}}>
            <ResponsiveLine
                data={data}
                margin={{top: 20, right: 20, bottom: 60, left: 80}}
                xScale={{type: 'point'}}
                yScale={{
                    type: 'linear',
                    stacked: true, // Hace que las áreas se acumulen si hay más series
                    min: 'auto',
                    max: 'auto',
                }}
                curve="monotoneX" // Curva suave
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Date',
                    legendOffset: 36,
                    legendPosition: 'middle',
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    legend: 'Debt',
                    legendOffset: -40,
                    legendPosition: 'middle',
                    format: (value) => `$${value}`,
                }}
                yFormat={value => {
                    return `$${value}`
                }}
                colors={{scheme: 'category10'}}
                enableArea={true} // Habilitar el área bajo la línea
                defs={[
                    // Gradiente para el área
                    linearGradientDef('gradientA', [
                        {offset: 0, color: 'blue'},
                        {offset: 100, color: 'blue', opacity: 0},
                    ]),
                ]}
                fill={[
                    // Aplicar el gradiente
                    {match: '*', id: 'gradientA'},
                ]}
                pointSize={10}
                pointBorderWidth={2}
                useMesh={true} // Para interacción suave
                animate={true} // Animación al cargar
                motionConfig="gentle"
                theme={{
                    text: {
                        fill: isDarkMode ? 'white' : 'black',
                    },
                    tooltip: {
                        container: {
                            background: isDarkMode ? 'black' : 'white',
                            color: isDarkMode ? 'white' : 'black',
                        },
                    },
                }}
            />
        </div>
    )
}