const copy_prospects_from_the_queue = () => {

    let updatingTime: Date = new Date();
    let isCompanyAvailable: boolean = false;
    const hours = updatingTime.getHours();
    const minutes = updatingTime.getMinutes();


    if (hours === 0 && minutes === 0) {
        console.log("Hello World");
    }else{
        console.log("bye");
    }
}

