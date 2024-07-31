import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { RestAPIURL } from '../../../Config/Settings';
import { Styles } from '../../../Config/Colors';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

export const ContactInfo = () => {

    const [formData, setFormData] = useState({
        employeeId: sessionStorage.getItem('EmployeeId'),
        phoneNo1: '',
        phoneNo2: '',
        temp_House_NO: '',
        temp_street_Name: '',
        temp_city_Name: '',
        temp_State: '',
        temp_country: '',
        temp_Pincode: '',
        perm_House_No: '',
        perm_street_Name: '',
        perm_City_Name: '',
        perm_State: '',
        perm_Country: '',
        perm_pin_code: ''
    });

    const [contacts, setContacts] = useState([]);
    const [phoneno1, setphone1] = useState("");
    const [phoneno2, setphone2] = useState("");
    const [tempHouseNo, settempHouseNo] = useState("");
    const [tempstreetName, settempstreetName] = useState("");
    const [tempcityName, settempcityName] = useState("");
    const [tempstate, settempstate] = useState("");
    const [tempcountry, settempcountry] = useState("");
    const [temppincode, settemppincode] = useState("");
    const [permhouseno, setpermhouseno] = useState("");
    const [permstreetname, setpermstreetname] = useState("");
    const [permcityname, setpermcityname] = useState("");
    const [permState, setpermState] = useState("");
    const [permcountry, setpermcountry] = useState("");
    const [permPinNo, setpermPinNo] = useState("");

    const initialform = {
        phoneNo1: '',
        phoneNo2: '',
        temp_House_NO: '',
        temp_street_Name: '',
        temp_city_Name: '',
        temp_State: '',
        temp_country: '',
        temp_Pincode: '',
        perm_House_No: '',
        perm_street_Name: '',
        perm_City_Name: '',
        perm_State: '',
        perm_Country: '',
        perm_pin_code: ''
    }

    useEffect(() => {
        // Fetch the existing contact info if employeeId is provided
        if (sessionStorage.getItem('EmployeeId')) {
            axios.get(RestAPIURL + `/EmpContactInfo/newcontactinfo/` + sessionStorage.getItem('EmployeeId'))
                .then(response => {
                    setFormData(response.data);
                    setContacts(response.data);

                })
                .catch(error => {
                    console.error('There was an error fetching the contact info!', error);
                });
        }
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateform = () => {
        let valid = true;
        const phoneRegex = /^\d{10}$/;
        if (!formData.phoneNo1) {
            setphone1("Primary phone number is required");
            return (valid = false);
        } else if (!phoneRegex.test(formData.phoneNo1)) {
            setphone1("Primary phone number must be 10 digits");
            return (valid = false);
        } else {
            setphone1("");
        }

        if (formData.phoneNo2 && !phoneRegex.test(formData.phoneNo2)) {
            setphone2("Secondary phone number must be 10 digits");
            return (valid = false);
        } else {
            setphone2("");
        }

        if (!formData.temp_House_NO) {
            settempHouseNo("Temporary house number is required");
            return (valid = false);
        } else {
            settempHouseNo("");
        }

        if (!formData.temp_street_Name) {
            settempstreetName("Temporary street name is required");
            return (valid = false);
        } else if (!/^[a-zA-Z\s]+$/.test(formData.temp_street_Name)) {
            settempstreetName("Temporary street name can only contain letters and spaces");
            return (valid = false);
        }
        else {
            settempstreetName("");
        }

        if (!formData.temp_city_Name) {
            settempcityName("Temporary city name is required");
            return (valid = false);
        } else if (!/^[a-zA-Z\s]+$/.test(formData.temp_city_Name)) {
            settempcityName("Temporary city name can only contain letters and spaces");
            return (valid = false);
        }
        else {
            settempcityName("");
        }

        if (!formData.temp_State) {
            settempstate("Temporary state is required");
            return (valid = false);
        } else if (!/^[a-zA-Z\s]+$/.test(formData.temp_State)) {
            settempstate("Temporary state  can only contain letters and spaces");
            return (valid = false);
        }
        else {
            settempstate("");
        }

        if (!formData.temp_country) {
            settempcountry("Temporary country is required");
            return (valid = false);
        } else if (!/^[a-zA-Z\s]+$/.test(formData.temp_country)) {
            settempcountry("Temporary country can only contain letters and spaces");
            return (valid = false);
        }
        else {
            settempcountry("");
        }


        if (!formData.temp_Pincode) {
            settemppincode("Temporary pincode is required");
            return (valid = false);
        } else if (!/^\d{6}$/.test(formData.temp_Pincode)) {
            settemppincode("Temporary pincode must be 6 digits");
            return (valid = false);
        } else {
            settemppincode("");
        }

        if (!formData.perm_House_No) {
            setpermhouseno("Permanent house number is required");
            return (valid = false);
        } else {
            setpermhouseno("");
        }

        if (!formData.perm_street_Name) {
            setpermstreetname("Permanent street name is required");
            return (valid = false);
        } else if (!/^[a-zA-Z\s]+$/.test(formData.perm_street_Name)) {
            setpermstreetname("Permanent street name can only contain letters and spaces");
            return (valid = false);
        } else {
            setpermstreetname("");
        }

        if (!formData.perm_City_Name) {
            setpermcityname("Permanent city name is required");
            return (valid = false);
        } else if (!/^[a-zA-Z\s]+$/.test(formData.perm_City_Name)) {
            setpermcityname("Permanent city name can only contain letters and spaces");
            return (valid = false);
        } else {
            setpermcityname("");
        }

        if (!formData.perm_State) {
            setpermState("Permanent state is required");
            return (valid = false);
        } else if (!/^[a-zA-Z\s]+$/.test(formData.perm_State)) {
            setpermState("Permanent street name can only contain letters and spaces");
            return (valid = false);
        } else {
            setpermState("");
        }


        if (!formData.perm_Country) {
            setpermcountry("Permanent country is required");
            return (valid = false);
        } else if (!/^[a-zA-Z\s]+$/.test(formData.perm_Country)) {
            setpermcountry("Permanent country name can only contain letters and spaces");
            return (valid = false);
        } else {
            setpermcountry("");
        }

        if (!formData.perm_pin_code) {
            setpermPinNo("Permanent pincode is required");
            return (valid = false);
        } else if (!/^\d{6}$/.test(formData.perm_pin_code)) {
            setpermPinNo("Permanent pincode must be 6 digits");
            return (valid = false);
        }
        else {
            setpermPinNo("");
        }

        return valid;

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submitted")


        if (validateform()) {
            axios.put(RestAPIURL + `/EmpContactInfo/newcontactinfooo/` + sessionStorage.getItem('EmployeeId'), formData)
                .then(response => {
                    console.log(response.data);
                    alert('Contact successfully updated');
                    setContacts(response.data);
                    setFormData(initialform);
                    // setFormData({
                    //     phoneNo1: '',
                    //     phoneNo2: '',
                    //     temp_House_NO: '',
                    //     temp_street_Name: '',
                    //     temp_city_Name: '',
                    //     temp_State: '',
                    //     temp_country: '',
                    //     temp_Pincode: '',
                    //     perm_House_No: '',
                    //     perm_street_Name: '',
                    //     perm_City_Name: '',
                    //     perm_State: '',
                    //     perm_Country: '',
                    //     perm_pin_code: ''
                    // });


                })


                .catch(error => {
                    console.error('There was an error updating the contact!', error);
                    alert(error.message);
                });
        }
    };

    const reset = () => {
        setFormData(initialform);
        setphone1("");
        setphone2("");
        settempHouseNo("");
        settempstreetName("");
        settempcityName("");
        settempstate("");
        settempcountry("");
        settemppincode("");
        setpermhouseno("");
        setpermstreetname("");
        setpermcityname("");
        setpermState("");
        setpermcountry("");
        setpermPinNo("");


    }




    return (
        <div className='container-fluid'>
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-10'>
                        <div class="card border  ">
                            <div className='d-flex justify-content-between  border-bottom' style={{ backgroundColor: Styles.VarGreen1 }}>

                                <p class="p-2  fs-2 fw-bold m-2 text-white" >Contact Information</p>

                                <div>
                                    <button className='btn border  m-3' data-bs-toggle="modal" data-bs-target="#staticBackdrop" ><Icon.PencilSquare size={25} color='white' /></button>

                                    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                            <div class="modal-content">
                                                <div class="modal-header" style={{ backgroundColor: Styles.VarDarkGreen2 }}>
                                                    <p class="modal-title text-white fw-bold fs-4 m-2" id="staticBackdropLabel">Update Contact Information</p>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={reset}></button>
                                                </div>
                                                <div class="modal-body">
                                                    <form >
                                                        <div className="form-group">
                                                            <label htmlFor="phoneNo1">Phone No 1</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="phoneNo1"
                                                                name="phoneNo1"
                                                                value={formData.phoneNo1}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{phoneno1}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="phoneNo2">Phone No 2</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="phoneNo2"
                                                                name="phoneNo2"
                                                                value={formData.phoneNo2}
                                                                onChange={handleChange}
                                                            />
                                                            <span className='text-danger'>{phoneno2}</span>
                                                        </div>
                                                        {/* Add similar input fields for all other properties */}
                                                        <div className="form-group">
                                                            <label htmlFor="temp_House_NO">Temporary House Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="temp_House_NO"
                                                                name="temp_House_NO"
                                                                value={formData.temp_House_NO}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{tempHouseNo}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="temp_street_Name">Temporary Street Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="temp_street_Name"
                                                                name="temp_street_Name"
                                                                value={formData.temp_street_Name}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{tempstreetName}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="temp_city_Name">Temporary City Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="temp_city_Name"
                                                                name="temp_city_Name"
                                                                value={formData.temp_city_Name}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{tempcityName}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="temp_State">Temporary State</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="temp_State"
                                                                name="temp_State"
                                                                value={formData.temp_State}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{tempstate}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="temp_country">Temporary Country</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="temp_country"
                                                                name="temp_country"
                                                                value={formData.temp_country}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{tempcountry}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="temp_Pincode">Temporary Pincode</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="temp_Pincode"
                                                                name="temp_Pincode"
                                                                value={formData.temp_Pincode}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{temppincode}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="perm_House_No">Permanent House Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="perm_House_No"
                                                                name="perm_House_No"
                                                                value={formData.perm_House_No}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{permhouseno}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="perm_street_Name">Permanent Street Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="perm_street_Name"
                                                                name="perm_street_Name"
                                                                value={formData.perm_street_Name}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{permstreetname}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="perm_City_Name">Permanent City Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="perm_City_Name"
                                                                name="perm_City_Name"
                                                                value={formData.perm_City_Name}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{permcityname}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="perm_State">Permanent State</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="perm_State"
                                                                name="perm_State"
                                                                value={formData.perm_State}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{permState}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="perm_Country">Permanent Country</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="perm_Country"
                                                                name="perm_Country"
                                                                value={formData.perm_Country}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{permcountry}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="perm_pin_code">Permanent Pincode</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="perm_pin_code"
                                                                name="perm_pin_code"
                                                                value={formData.perm_pin_code}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <span className='text-danger'>{permPinNo}</span>
                                                        </div>


                                                    </form>


                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn text-white" onClick={handleSubmit} style={{ backgroundColor: Styles.VarDarkGreen2 }}>Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="card-body">
                                {contacts && (
                                    <div className="card">
                                        <div className="card-body">

                                            <div className='d-flex justify-content-between m-4'>
                                                <div className=''>
                                                    <p><strong>Phone No 1:</strong> {contacts.phoneNo1}</p>
                                                    <p><strong className='text-primary'>Temporary:</strong></p>
                                                    <p><strong> Pincode:</strong> {contacts.temp_Pincode}</p>
                                                    {/* <p><strong>Phone No 2:</strong> {contacts.phoneNo2}</p> */}
                                                    <p><strong> House Number:</strong> {contacts.temp_House_NO}</p>
                                                    <p><strong> Street Name:</strong> {contacts.temp_street_Name}</p>
                                                    <p><strong> City Name:</strong> {contacts.temp_city_Name}</p>
                                                    <p><strong> State:</strong> {contacts.temp_State}</p>
                                                    <p><strong> Country:</strong> {contacts.temp_country}</p>
                                                </div>

                                                <div className=''>
                                                    {/* <p><strong>Temporary Pincode:</strong> {contacts.temp_Pincode}</p> */}
                                                    <p><strong>Phone No 2:</strong> {contacts.phoneNo2}</p>
                                                    <p><strong className='text-primary'>Permanent:</strong></p>
                                                    <p><strong> House Number:</strong> {contacts.perm_House_No}</p>
                                                    <p><strong> Street Name:</strong> {contacts.perm_street_Name}</p>
                                                    <p><strong> City Name:</strong> {contacts.perm_City_Name}</p>
                                                    <p><strong> State:</strong> {contacts.perm_State}</p>
                                                    <p><strong> Country:</strong> {contacts.perm_Country}</p>
                                                    <p><strong> Pincode:</strong> {contacts.perm_pin_code}</p>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
