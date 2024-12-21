import { useState } from "react";
import { MdOutlineCategory } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaShoppingBasket } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { Card } from 'antd';
import ReactApexChart from 'react-apexcharts'


export default function Dashboard() {

    // eslint-disable-next-line no-unused-vars
    const [donut, setDonut] = useState({  
        series: [44, 55, 41, 17, 15, 23, 32],
        options: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            chart: {
                type: 'donut',
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '30%'
                    }
                }
            },
            legend: {
                position: 'bottom',
            },
        },
    });


    // eslint-disable-next-line no-unused-vars
    const [line, setLine] = useState({
          
        series: [{
            name: "Desktops",
            data: [23000, 55000, 12000, 40000, 51000, 42000, 35000, 50000, 60000, 30000, 40000, 72000]
        }],
        options: {
          chart: {
            // height: 350,
            type: 'line',
            zoom: {
              enabled: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },    
          xaxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          },
          yaxis: {
            labels: {
              formatter: function (value) {
                return "$ " + value;
              }
            },
          },
        },
      
      
    });


    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-normal ">Dashboard</h1>
            <div className="grid lg:grid-cols-4 gap-5">
                <div className="px-5 py-6 bg-white shadow-md rounded-md border-l-4 border-[currentColor] text-blue-500">
                    <div className="flex justify-between gap-6 items-center text-2xl">
                        <div className="flex-flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase">Category</h3>
                            <p className="text-slate-600 text-lg font-bold">134</p>
                        </div>
                        <MdOutlineCategory />
                    </div>
                </div>
                <div className="px-5 py-6 bg-white shadow-md rounded-md border-l-4 border-[currentColor] text-green-400">
                    <div className="flex justify-between gap-6 items-center text-2xl">
                        <div className="flex-flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase">Products</h3>
                            <p className="text-slate-600 text-lg font-bold">73</p>
                        </div>
                        <BiSolidPurchaseTag />
                    </div>
                </div>
                <div className="px-5 py-6 bg-white shadow-md rounded-md border-l-4 border-[currentColor] text-teal-400">
                    <div className="flex justify-between gap-6 items-center text-2xl">
                        <div className="flex-flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase">Order</h3>
                            <p className="text-slate-600 text-lg font-bold">165</p>
                        </div>
                        <FaShoppingBasket />
                    </div>
                </div>
                <div className="px-5 py-6 bg-white shadow-md rounded-md border-l-4 border-[currentColor] text-yellow-400">
                    <div className="flex justify-between gap-6 items-center text-2xl">
                        <div className="flex-flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase">Post</h3>
                            <p className="text-slate-600 text-lg font-bold">3</p>
                        </div>
                        <FaPenToSquare />
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
            <Card title="Earnings Review" bordered={false} className="bg-white shadow-xl rounded-md" style={{boxShadow: '0 10px 25px rgb(0 0 0 / 0.1), 0 4px 10px -3px rgb(0 0 0 / 0.1)'}}>
                {
                     <ReactApexChart options={line.options} series={line.series} type="line" height={350} />
                }
            </Card>
            <Card title="Users" bordered={false} className="bg-white shadow-xl rounded-md" style={{boxShadow: '0 10px 25px rgb(0 0 0 / 0.15), 0 4px 10px -3px rgb(0 0 0 / 0.15)'}}>
                {
                     <ReactApexChart options={donut.options} series={donut.series} type="donut" className="md:max-w-[500px] mx-auto"/>
                }
            </Card>
            </div>
        </div>
    )
}