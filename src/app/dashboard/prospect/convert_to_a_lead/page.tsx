import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select } from "@/app/components/ui/select";
import styles from './styles.module.css';
import ProgressBar from "@/app/components/ui/progress";
import ListGroup from "@/app/components/ui/list_groups";
import Image from "next/image";


export default function MakeALeadPage() {
    return(
        <>
             <div className="container mx-auto pt-0">
                <h1 className="text-2xl font-bold mb-6 ml-4">Lead Conversion</h1>
                <div className="grid grid-cols-2 gap-16 pr-6">
                <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
                    <div className="px-14 py-14">
                        <h1 className="text-2xl font-bold mb-6 ml-4">Convert Lead</h1>
                        <Label htmlFor="name" className="ml-4 mr-4"> Company Name:</Label>
                        <Input placeholder="Company" className={`w-full ml-4 mt-5 ${styles.mr4} mb-4`} type="text" disabled="true"/>

                        <Label htmlFor="name" className="ml-4 mr-4"> Product:</Label>
                        <Select 
                            options=
                            {
                                [
                                    { value: 'igv', label: 'iGV' },
                                    { value: 'igt', label: 'iGT' },
                                    { value: 'ogv', label: 'oGV' },
                                    { value: 'ogt', label: 'oGT' },
                                ]
                            }
                            defaultValue="igv"
                            disabled="true"
                            className="w-full ml-4 mt-5 mr-4 mb-4"
                            />

                        <Label htmlFor="name" className="ml-4">Proof Document :</Label>
                        <Input placeholder="Select your Proof" className="w-full ml-4 mt-5 mb-4 mr-4" type="file" accept="image/*, .pdf"/>
                        <Image
                            src="/pdf_icon.png"
                            alt="pdf_icon"
                            width={100} 
                            height={100} 
                            className="ml-4 mt-5 mb-4 mr-4"
                        />


                        <Label htmlFor="name" className="ml-4 mr-4"> Activities:</Label>
                        <Input placeholder="Enter / for a new activity" className={`w-full ml-4 mt-5 ${styles.mr4} mb-8`} type="text"/>
                        
                        <Button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-4 mb-8">Convert to a Lead</Button>
                        <Button className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded ml-4 mb-8">Reset</Button>
                        
                    </div>
                </div>
                
                <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
                    <div className="px-14 py-14">
                        <h1 className="text-2xl font-bold mb-6 ml-4">Summery</h1>
                        <div className="pl-4 pr-4">
                            <Label htmlFor="name"> Status:</Label>
                            <ProgressBar text={"Lead"} color={"blue"} width={"60%"} className="mt-4 mb-4"/>

                            <Label htmlFor="name"> Expire Countdown:</Label>
                            <ProgressBar text={"90 days remaining"} color={"green"} width={"90%"} className="mt-4 mb-4"/>

                            <Label htmlFor="name"> Expire Date:</Label>
                            <Input placeholder="26/12/2024" className={`w-full mt-5 ${styles.mr4} mb-4`} type="text" disabled="true"/>

                            <Label htmlFor="name"> Activities: </Label>
                            <ListGroup values={["Activity 1", "Activity 2"]} className="mt-4 mb-4"/>

                            <Label htmlFor="name"> Proof Document: </Label>
                            <Image
                            src="/pdf_icon.png"
                            alt="pdf_icon"
                            width={100} 
                            height={100} 
                            className="ml-4 mt-5 mb-4 mr-4"
                        />
                        </div>
                        
                    </div>
                </div>
                </div>
      
            </div>
        </>
    )
}