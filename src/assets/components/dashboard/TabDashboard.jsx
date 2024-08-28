import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Badge,
} from "@material-tailwind/react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  Square3Stack3DIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CheckIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import fetchData2 from "../servicios/fetchData2";
import { AuthContext } from "../../../AuthContext";
const apiUrl = import.meta.env.VITE_API_URL;
const initialChartConfig = {
  type: "bar",
  height: 240,
  series: [
    {
      name: "Sales",
      data: [],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 2,
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: [],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
};

const initialPieChartConfig = {
  type: "pie",
  width: 280,
  height: 280,
  series: [],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"],
    legend: {
      show: false,
    },
    labels: [],
  },
};

export function TabDashboard() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialData = await fetchData2(`${apiUrl}/consultar_dashboard`, token);
        setData(initialData);
        console.log("datos pie ", initialData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      navigate("/"); // Redirigir al inicio si no hay token
    } else {
      fetchData();
    }
  }, [token, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  const { 
    datos_grafica_barra_compra, 
    datos_grafica_barra_venta, 
    datos_grafica_circular_productos_vendidos, 
    datos_totales, 
    semanas 
  } = data;

  const totalData = datos_totales[0];
  
  const barChartConfigCompra = {
    ...initialChartConfig,
    series: [{ name: "Compras", data: datos_grafica_barra_compra }],
    options: { ...initialChartConfig.options, xaxis: { ...initialChartConfig.options.xaxis, categories: semanas } },
  };

  const barChartConfigVenta = {
    ...initialChartConfig,
    series: [{ name: "Ventas", data: datos_grafica_barra_venta }],
    options: { ...initialChartConfig.options, xaxis: { ...initialChartConfig.options.xaxis, categories: semanas } },
  };

  const pieChartConfig = {
    ...initialPieChartConfig,
    series: datos_grafica_circular_productos_vendidos.map(p => parseInt(p.cantidad_producto)), // Convertir a entero
    options: { ...initialPieChartConfig.options, labels: datos_grafica_circular_productos_vendidos.map(p => p.nombre_producto) },
  };
  


  return (
    <>
      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col justify-between gap-4 rounded-none md:flex-row md:items-center"
        >
          <div className="border-4 border-sky-500 rounded-lg p-5 shadow-lg flex items-center gap-4">
            <div className="bg-gray-900 rounded-full p-4">
              <Badge content="X" color="red">
                <ShoppingCartIcon className="h-8 w-8 text-white" />
              </Badge>
            </div>
            <div>
              <Typography variant="h4" className="text-gray-600 flex flex-col items-center gap-2">
                Compras
              </Typography>
              <Typography variant="h6" className="text-black flex flex-col items-center gap-2">
                {totalData.total_compras_anuladas} anuladas
              </Typography>
            </div>
          </div>
          <div className="border-4 border-sky-500 rounded-lg p-5 shadow-lg flex items-center gap-4">
            <div className="bg-gray-900 rounded-full p-4">
              <Badge
                content={<CheckIcon className="h-4 w-4 text-white" strokeWidth={2.5} />}
                className="bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20"
              >
                <ShoppingCartIcon className="h-8 w-8 text-white" />
              </Badge>
            </div>
            <div>
              <Typography variant="h4" className="text-gray-600 flex flex-col items-center gap-2">
                Compras
              </Typography>
              <Typography variant="h6" className="text-black flex flex-col items-center gap-2">
                {totalData.total_compras_exitosas} exitosas
              </Typography>
            </div>
          </div>
          <a href="/clientes">
          <div className="border-4 border-sky-500 rounded-lg p-5 shadow-lg flex items-center gap-4">
            <div className="bg-gray-900 rounded-full p-4">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
          
            <div>
              <Typography variant="h4" className="text-gray-600 flex flex-col items-center gap-2">
                Clientes
              </Typography>
              <Typography variant="h6" className="text-black flex flex-col items-center gap-2">
                {totalData.total_cliente} registrados
              </Typography>
            </div>
           
          </div> </a>
          <div className="border-4 border-sky-500 rounded-lg p-5 shadow-lg flex items-center gap-4">
            <div className="bg-gray-900 rounded-full p-4">
              <Badge content="X" color="red">
                <CurrencyDollarIcon className="h-8 w-8 text-white" />
              </Badge>
            </div>
            <div>
              <Typography variant="h4" className="text-gray-600 flex flex-col items-center gap-2">
                Ventas
              </Typography>
              <Typography variant="h6" className="text-black flex flex-col items-center gap-2">
                {totalData.total_ventas_anuladas} anuladas
              </Typography>
            </div>
          </div>
          <div className="border-4 border-sky-500 rounded-lg p-5 shadow-lg flex items-center gap-4">
            <div className="bg-gray-900 rounded-full p-4">
              <Badge
                content={<CheckIcon className="h-4 w-4 text-white" strokeWidth={2.5} />}
                className="bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20"
              >
                <CurrencyDollarIcon className="h-8 w-8 text-white" />
              </Badge>
            </div>
            <div>
              <Typography variant="h4" className="text-gray-600 flex flex-col items-center gap-2">
                Ventas
              </Typography>
              <Typography variant="h6" className="text-black flex flex-col items-center gap-2">
                {totalData.total_ventas_exitosas} exitosas
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-2 pb-0 flex flex-wrap justify-center">
  <div className="w-full sm:w-1/2 lg:w-1/3 h-auto flex flex-col items-center mb-4">
    <Typography variant="h6" className="mb-2 text-center">
      Compras Realizadas
    </Typography>
    <Chart {...barChartConfigCompra} />
  </div>

  <div className="w-full sm:w-1/2 lg:w-1/3 h-auto flex flex-col items-center mb-4">
    <Typography variant="h6" className="mb-2 text-center">
      Productos Más Vendidos
    </Typography>
    <Chart {...pieChartConfig} />
  </div>

  <div className="w-full sm:w-1/2 lg:w-1/3 h-auto flex flex-col items-center mb-4">
    <Typography variant="h6" className="mb-2 text-center">
      Ventas Realizadas
    </Typography>
    <Chart {...barChartConfigVenta} />
  </div>
</CardBody>


      </Card>
    </>
  );
}
