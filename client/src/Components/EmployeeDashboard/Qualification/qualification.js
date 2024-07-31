import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Icon from "react-bootstrap-icons";
import { RestAPIURL } from "../../../Config/Settings";
import { Styles } from "../../../Config/Colors";
import { sessionManager } from "../../../Config/sessionmanager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { toast, ToastContainer } from "react-toastify";
import { Button, Modal } from "antd";

export const Basicinfo = () => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [qualificationtype, setqualificationtype] = useState("");
  const [qualificationTittle, setQualificationTittle] = useState("");
  const [majorfeildofstudy, setMajorfeildofstudy] = useState("");
  const [percentageofcgba, setpercentageofcgba] = useState("");
  const [instituteorcollegeName, setinstituteorcollegeName] = useState("");
  const [address, setaddress] = useState("");
  const [document, setdocument] = useState("");
  const [editQualification, setEditQualification] = useState(null);
  const [qualificationid, setqualificationid] = useState();
  const [editcertificate, seteditcetificate] = useState(false);
  const [filename, setfilename] = useState("");
  const EmpId = sessionManager.getEmployeeId();

  const fetchEmployee = async () => {
    try {
      console.log(EmpId);
      const response = await axios.get(
        RestAPIURL + "/EmpQualiInfo/newemployeeinfo/" + EmpId
      );
      setFormData(response.data);
      setEmployee(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchEmployee();
  }, []);

  const initialFormData = {
    qualificationType: "",
    qualificationTitle: "",
    MajorFeildOfStudy: "",
    percentageOrcgba: "",
    instituteOrCollegeName: "",
    Address: "",
    certificate: null,
  };

  // new
  const [formData, setFormData] = useState({
    employeeId: EmpId,
    qualificationType: "",
    qualificationTitle: "",
    MajorFeildOfStudy: "",
    percentageOrcgba: "",
    instituteOrCollegeName: "",
    Address: "",
    certificate: null, // Assuming you have a file input for certification documents
  });

  const validate = () => {
    console.log("Vlidate")
    let valid = true;
    if (!formData.qualificationType) {
      setqualificationtype("Qualification Type is required");
      return (valid = false);
    } else {
      setqualificationtype("");
    }

    if (!formData.qualificationTitle) {
      setQualificationTittle("Qualification Title is required");
      return (valid = false);
    } else if (!/^[a-zA-Z\s]+$/.test(formData.qualificationTitle)) {
      setQualificationTittle(
        "Qualification Title can only contain letters and spaces"
      );
      return (valid = false);
    } else {
      setQualificationTittle("");
    }

    if (formData.qualificationType !== "Certification") {
      if (!formData.MajorFeildOfStudy) {
        setMajorfeildofstudy("Major Field of Study is required");
        return (valid = false);
      } else if (!/^[a-zA-Z\s]+$/.test(formData.MajorFeildOfStudy)) {
        setMajorfeildofstudy(
          "Major Field of Study can only contain letters and spaces"
        );
        return (valid = false);
      } else {
        setMajorfeildofstudy("");
      }

      if (!formData.percentageOrcgba) {
        setpercentageofcgba("Percentage or CGPA is required");
        return (valid = false);
      } else if (!/^\d+(\.\d+)?$/.test(formData.percentageOrcgba)) {
        setpercentageofcgba("Percentage or CGPA must be a valid number");
        return (valid = false);
      } else if (parseFloat(formData.percentageOrcgba) > 100) {
        setpercentageofcgba("Percentage cannot be more than 100");
        return (valid = false);
      } else {
        setpercentageofcgba("");
      }
    }

    if (!formData.instituteOrCollegeName) {
      setinstituteorcollegeName("Institute or College Name is required");
      return (valid = false);
    } else if (!/^[a-zA-Z\s]+$/.test(formData.instituteOrCollegeName)) {
      setinstituteorcollegeName(
        "Institute or College Name can only contain letters and spaces"
      );
      return (valid = false);
    } else {
      setinstituteorcollegeName("");
    }

    if (!formData.Address) {
      setaddress("Address is required");
      return (valid = false);
    } else if (formData.Address.length > 200) {
      setaddress("Address cannot be more than 200 characters");
      return (valid = false);
    } else {
      setaddress("");
    }

    if (formData.qualificationType === "Certification") {
      if (!formData.file) {
        setdocument("Document is required");
        return (valid = false);
      } else {
        setdocument("");
      }
    }

    // if (formData.qualificationType === 'Certification') {
    //     if (!formData.file) {
    //         setdocument("Certificate file is required");
    //         return (valid = false);
    //     }
    //      else if (!['application/pdf', 'image/jpeg',].includes(formData.certificate.type)) {
    //         setdocument("Certificate file must be a PDF or image (JPEG/PNG)");
    //         return (valid = false);
    //     }
    //     else if (formData.certificate.size > 5 * 1024 * 1024) { // 2MB limit
    //         setdocument("Certificate file size must be less than 2MB");
    //         return (valid = false);
    //     }
    //     else{
    //         setdocument("");
    //     }
    // }

    return valid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "certificate") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        let response;
        const {
          qualificationType,
          qualificationTitle,
          instituteOrCollegeName,
          Address,
          file,
          MajorFeildOfStudy,
          percentageOrcgba,
        } = formData;

        if (qualificationType === "Certification") {
          const formDataCert = new FormData();
          formDataCert.append("qualificationType", qualificationType);
          formDataCert.append("qualificationTitle", qualificationTitle);
          formDataCert.append("instituteOrCollegeName", instituteOrCollegeName);
          formDataCert.append("Address", Address);
          formDataCert.append("certificate", file);

          response = await axios.put(
            RestAPIURL + "/EmpQualiInfo/with/" + EmpId,
            formDataCert,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.error) {
            toast.warning(response.data.error);
          } else {
            toast.success("Added  certificate info successfully");
          }

          console.log(response.data); 
        } else {
          response = await axios.put(
            RestAPIURL + "/EmpQualiInfo/without/" + EmpId,
            {
              qualificationType,
              qualificationTitle,
              MajorFeildOfStudy,
              percentageOrcgba,
              instituteOrCollegeName,
              Address,
            }
          );
          if (response.data.error) {
            toast.warning(response.data.error);
          } else {
            toast.success("Added without certificate info successfully");
          }

          console.log(response.data); 
        }
        setEmployee(response.data);
        setFormData({
          qualificationType: "",
          qualificationTitle: "",
          MajorFeildOfStudy: "",
          percentageOrcgba: "",
          instituteOrCollegeName: "",
          Address: "",
          certificate: null,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleEdit = async (qualificationId) => {
    setEditQualification(qualificationId);
    const qualification =
      employee.withoutcertificate.find((q) => q._id === qualificationId) ||
      employee.document.find((q) => q._id === qualificationId);

    setqualificationid(qualification._id);
    setFormData({
      qualificationType: qualification.qualificationType,
      qualificationTitle: qualification.qualificationTitle,
      MajorFeildOfStudy: qualification.MajorFeildOfStudy || "",
      percentageOrcgba: qualification.percentageOrcgba || "",
      instituteOrCollegeName: qualification.instituteOrCollegeName,
      Address: qualification.Address,
      certifiate: qualification.File,
    });
    if (qualification.File) {
      seteditcetificate(true);

      setfilename(qualification.File.originalname);
    }
    // console.log(qualification.File);
    // console.log(qualification);
  };

  const handleUpdate = async (e) => {
    console.log(formData);
    console.log("sub");
    e.preventDefault();
    console.log(formData.qualificationType);

    if (validate()) {
      try {
        let response;

        const {
          qualificationType,
          qualificationTitle,
          instituteOrCollegeName,
          Address,
          file,
        } = formData;

        console.log(qualificationType +298);

        // if(qualificationType !== "Certification") {
          console.log("certifican if");
          const formDataCert = new FormData();
          formDataCert.append("qualificationType", qualificationType);
          formDataCert.append("qualificationTitle", qualificationTitle);
          formDataCert.append("instituteOrCollegeName", instituteOrCollegeName);
          formDataCert.append("Address", Address);
          if (file) formDataCert.append("certificate", file);
          response = await axios.put(
            RestAPIURL +
              "/EmpQualiInfo/editwith/" +
              qualificationid +
              "/" +
              EmpId,
            formDataCert,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.error) {
            toast.warning(response.data.error);
          } else {
            console.log("info");
            toast.success(response.data.message);
            fetchEmployee();
            setFormData(initialFormData);
            editcertificate(false);
          }

          console.log(response.data);

          setEditQualification(null);
          setFormData({
            qualificationType: "",
            qualificationTitle: "",
            MajorFeildOfStudy: "",
            percentageOrcgba: "",
            instituteOrCollegeName: "",
            Address: "",
            certificate: null,
          });
        // }
        // else {
        //   console.log(qualificationType);
        //   response = await axios.put(
        //     RestAPIURL +
        //       "/EmpQualiInfo/editwithoutcer/" +
        //       qualificationid +
        //       "/" +
        //       EmpId,
        //     {
        //       qualificationType,
        //       qualificationTitle,
        //       MajorFeildOfStudy: formData.MajorFeildOfStudy,
        //       percentageOrcgba: formData.percentageOrcgba,
        //       instituteOrCollegeName,
        //       Address,
        //     }
        //   );

        //   if (response.data.error) {
        //     toast.warning(response.data.error);
        //   } else {
        //     toast.success("without certi is updated");
        //     fetchEmployee();
        //     setFormData(initialFormData);
        //   }
        //   console.log(response.data);
        //   console.log("kkk");
        //  }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
    setPreviewVisible(true);
  };
  const handleCancelPreview = () => {
    setPreviewVisible(false);
    setPreviewDocument(null);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setqualificationtype("");
    setQualificationTittle("");
    setpercentageofcgba("");
    setMajorfeildofstudy("");
    setinstituteorcollegeName("");
    setaddress("");
    setdocument("");
  };

  return (
    <div className="container-fluid ">
      <div className="container ">
        <div className="row">
          <div className="col-lg-10">
            <div className="card border">
              <div
                className="d-flex justify-content-between border-bottom "
                style={{ backgroundColor: Styles.VarGreen1 }}
              >
                <p className="p-3  fs-3 fw-bold m-2 text-white">
                  Qualification Information{" "}
                </p>

                <div>
                  <button
                    className="btn border border-white m-4"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    <Icon.PlusLg size={25} color="white" />
                  </button>
                  <div
                    className="modal fade"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div
                          className="modal-header "
                          style={{ backgroundColor: Styles.VarDarkGreen2 }}
                        >
                          <h1
                            className="modal-title fs-4  text-white fw-bold"
                            id="staticBackdropLabel"
                          >
                            Update Qualification Info
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            onClick={resetForm}
                            aria-label="Close"
                          ></button>
                        </div>

                        <div className="modal-body">
                          <div className="row g-3 ">
                            <div className="col-md-12 col-lg">
                              <form>
                                <div className="form-group">
                                  <label>Qualification Type:</label>
                                  <select
                                    className="form-control"
                                    name="qualificationType"
                                    value={formData.qualificationType}
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value="">Select</option>
                                    <option value="Certification">
                                      Certification
                                    </option>
                                    <option value="Degree">Degree</option>
                                    <option value="Diplamo">Diplamo</option>
                                    <option value="PG">PG</option>
                                    <option value="UG">UG</option>
                                  </select>
                                  <span className="text-danger">
                                    {qualificationtype}
                                  </span>
                                </div>
                                <div className="form-group">
                                  <label>Qualification Title:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="qualificationTitle"
                                    value={formData.qualificationTitle}
                                    onChange={handleChange}
                                    required
                                  />
                                  <span className="text-danger">
                                    {qualificationTittle}
                                  </span>
                                </div>
                                {formData.qualificationType !==
                                  "Certification" && (
                                  <>
                                    <div className="form-group">
                                      <label>Major Field of Study:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="MajorFeildOfStudy"
                                        value={formData.MajorFeildOfStudy}
                                        onChange={handleChange}
                                      />
                                      <span className="text-danger">
                                        {majorfeildofstudy}
                                      </span>
                                    </div>
                                    <div className="form-group">
                                      <label>Percentage or CGPA:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="percentageOrcgba"
                                        value={formData.percentageOrcgba}
                                        onChange={handleChange}
                                      />
                                      <span className="text-danger">
                                        {percentageofcgba}
                                      </span>
                                    </div>
                                  </>
                                )}
                                <div className="form-group">
                                  <label>Institute or College Name:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="instituteOrCollegeName"
                                    value={formData.instituteOrCollegeName}
                                    onChange={handleChange}
                                    required
                                  />
                                  <span className="text-danger">
                                    {instituteorcollegeName}
                                  </span>
                                </div>
                                <div className="form-group">
                                  <label>Address:</label>
                                  <textarea
                                    className="form-control"
                                    name="Address"
                                    value={formData.Address}
                                    onChange={handleChange}
                                    required
                                  />
                                  <span className="text-danger">{address}</span>
                                </div>
                                {formData.qualificationType ===
                                  "Certification" && (
                                  <div className="form-group">
                                    <label>Upload Document:</label>
                                    <input
                                      type="file"
                                      className="form-control"
                                      name="certificate"
                                      onChange={handleChange}
                                      required
                                    />
                                    <span className="text-danger">
                                      {document}
                                    </span>
                                  </div>
                                )}
                              </form>
                            </div>
                          </div>
                        </div>

                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={resetForm}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn text-white"
                            onClick={handleSubmit}
                            style={{ backgroundColor: Styles.VarDarkGreen2 }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body ">
                {employee && (
                  <div className="card-body ">
                    {employee.withoutcertificate &&
                      employee.withoutcertificate.map(
                        (qualification, index) => (
                          <div key={index} className="card mt-2">
                            <div className="card-body ">
                              <div className="d-flex justify-content-between m-3">
                                <div>
                                  <p className="card-text ">
                                    <strong>Qualification Type:</strong>{" "}
                                    {qualification.qualificationType}
                                  </p>
                                  <p className="card-text ">
                                    <strong>Qualification Tittle:</strong>{" "}
                                    {qualification.qualificationTitle}
                                  </p>
                                  <p className="card-text ">
                                    <strong>Major Field of Study:</strong>{" "}
                                    {qualification.MajorFeildOfStudy}
                                  </p>
                                  <p className="card-text ">
                                    <strong>Percentage/CGPA:</strong>{" "}
                                    {qualification.percentageOrcgba}
                                  </p>
                                  <p className="card-text ">
                                    <strong>Institute/College Name:</strong>{" "}
                                    {qualification.instituteOrCollegeName}
                                  </p>
                                  <p className="card-text ">
                                    <strong>Address:</strong>{" "}
                                    {qualification.Address}
                                  </p>
                                </div>
                                <div>
                                  <button
                                    className="btn border border-primary m-2"
                                    onClick={() =>
                                      handleEdit(qualification._id)
                                    }
                                    data-bs-toggle="modal"
                                    data-bs-target="#staticBack"
                                  >
                                    <Icon.PencilSquare size={20} color="blue" />
                                  </button>

                                  <div
                                    className="modal fade"
                                    id="staticBack"
                                    data-bs-backdrop="static"
                                    data-bs-keyboard="false"
                                    tabindex="-1"
                                    aria-labelledby="staticBackdropLabel"
                                    aria-hidden="true"
                                  >
                                    <div className="modal-dialog modal-dialog-centered">
                                      <div className="modal-content">
                                        <div
                                          className="modal-header "
                                          style={{
                                            backgroundColor:
                                              Styles.VarDarkGreen2,
                                          }}
                                        >
                                          <h1
                                            className="modal-title fs-4 text-white fw-bold"
                                            id="staticBackdropLabel"
                                          >
                                            Update Qualification Info
                                          </h1>
                                          <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            onClick={resetForm}
                                            aria-label="Close"
                                          ></button>
                                        </div>

                                        <div className="modal-body">
                                          <div className="row g-3 ">
                                            <div className="col-md-12 col-lg">
                                              <form>
                                                <div className="form-group">
                                                  <label>
                                                    Qualification Type:
                                                  </label>
                                                  <select
                                                    className="form-control"
                                                    name="qualificationType"
                                                    value={
                                                      formData.qualificationType
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                  >
                                                    <option value="">
                                                      Select
                                                    </option>
                                                    <option value="Certification">
                                                      Certification
                                                    </option>
                                                    <option value="Degree">
                                                      Degree
                                                    </option>
                                                    <option value="Diplamo">
                                                      Diplamo
                                                    </option>
                                                    <option value="PG">
                                                      PG
                                                    </option>
                                                    <option value="UG">
                                                      UG
                                                    </option>
                                                  </select>
                                                  <span className="text-danger">
                                                    {qualificationtype}
                                                  </span>
                                                </div>
                                                <div className="form-group">
                                                  <label>
                                                    Qualification Title:
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    name="qualificationTitle"
                                                    value={
                                                      formData.qualificationTitle
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                  />
                                                  <span className="text-danger">
                                                    {qualificationTittle}
                                                  </span>
                                                </div>
                                                {formData.qualificationType !==
                                                  "Certification" && (
                                                  <>
                                                    <div className="form-group">
                                                      <label>
                                                        Major Field of Study:
                                                      </label>
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        name="MajorFeildOfStudy"
                                                        value={
                                                          formData.MajorFeildOfStudy
                                                        }
                                                        onChange={handleChange}
                                                      />
                                                      <span className="text-danger">
                                                        {majorfeildofstudy}
                                                      </span>
                                                    </div>
                                                    <div className="form-group">
                                                      <label>
                                                        Percentage or CGPA:
                                                      </label>
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        name="percentageOrcgba"
                                                        value={
                                                          formData.percentageOrcgba
                                                        }
                                                        onChange={handleChange}
                                                      />
                                                      <span className="text-danger">
                                                        {percentageofcgba}
                                                      </span>
                                                    </div>
                                                  </>
                                                )}
                                                <div className="form-group">
                                                  <label>
                                                    Institute or College Name:
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    name="instituteOrCollegeName"
                                                    value={
                                                      formData.instituteOrCollegeName
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                  />
                                                  <span className="text-danger">
                                                    {instituteorcollegeName}
                                                  </span>
                                                </div>
                                                <div className="form-group">
                                                  <label>Address:</label>
                                                  <textarea
                                                    className="form-control"
                                                    name="Address"
                                                    value={formData.Address}
                                                    onChange={handleChange}
                                                    required
                                                  />
                                                  <span className="text-danger">
                                                    {address}
                                                  </span>
                                                </div>
                                                {/* {formData.qualificationType ===
                                                  "Certification" ? (
                                                  <>
                                                    <>
                                                      {editcertificate && (
                                                        <>
                                                          <label>
                                                            {filename}
                                                          </label>
                                                          <Button
                                                            type="link"
                                                            onClick={() => {
                                                              seteditcetificate(
                                                                false
                                                              );
                                                            }}
                                                          >
                                                            X
                                                          </Button>
                                                        </>
                                                      )}
                                                      {!editcertificate && (
                                                        <>
                                                          <div className="form-group">
                                                            <label>
                                                              Upload Document:
                                                            </label>
                                                            <input
                                                              type="file"
                                                              className="form-control"
                                                              name="certificate"
                                                              onChange={
                                                                handleChange
                                                              }
                                                              required
                                                            />
                                                            <span className="text-danger">
                                                              {document}
                                                            </span>
                                                          </div>

                                                        </>
                                                      )}
                                                    </>
                                                  </>
                                                ) : (
                                                  <></>
                                                )} */}
                                              </form>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="modal-footer">
                                          <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                            onClick={resetForm}
                                          >
                                            Close
                                          </button>
                                          <button
                                            type="submit"
                                            className="btn text-white"
                                            onClick={handleUpdate}
                                            style={{
                                              backgroundColor:
                                                Styles.VarDarkGreen2,
                                            }}
                                          >
                                            Update
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    {employee.document &&
                      employee.document.map((qualification, index) => (
                        <div key={index} className="card mt-2">
                          <div className="card-body">
                            <div className="d-flex justify-content-between m-3">
                              <div>
                                <p className="card-text">
                                  <strong>Qualification Type:</strong>{" "}
                                  {qualification.qualificationType}
                                </p>
                                <p className="card-text">
                                  <strong>Qualifiation Tittle:</strong>{" "}
                                  {qualification.qualificationTitle}
                                </p>
                                <p className="card-text">
                                  <strong>Institute/College Name:</strong>{" "}
                                  {qualification.instituteOrCollegeName}
                                </p>
                                <p className="card-text">
                                  <strong>Address:</strong>{" "}
                                  {qualification.Address}
                                </p>
                                {
                                  qualification.File &&
                                    qualification.File.originalname && (
                                      <div>
                                        <p className="card-text">
                                          <strong>File Name:</strong>{" "}
                                          {qualification.File.originalname}
                                        </p>

                                        <Button
                                          type="link"
                                          style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            backgroundColor:
                                              Styles.VarDarkGreen2,
                                            fontSize: "16px",
                                          }}
                                          onClick={() =>
                                            handlePreview(qualification.File)
                                          }
                                        >
                                          Preview
                                        </Button>
                                      </div>
                                    ) // ))
                                }
                              </div>

                              <div>
                                <button
                                  className="btn border border-primary m-2"
                                  onClick={() => handleEdit(qualification._id)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticBackcer"
                                >
                                  <Icon.PencilSquare size={20} color="blue" />
                                </button>

                                <div
                                  className="modal fade"
                                  id="staticBackcer"
                                  data-bs-backdrop="static"
                                  data-bs-keyboard="false"
                                  tabindex="-1"
                                  aria-labelledby="staticBackdropLabel"
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                      <div
                                        className="modal-header "
                                        style={{
                                          backgroundColor: Styles.VarDarkGreen2,
                                        }}
                                      >
                                        <h1
                                          className="modal-title fs-4 text-white fw-bold"
                                          id="staticBackdropLabel"
                                        >
                                          Update Qualification Info
                                        </h1>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          onClick={resetForm}
                                          aria-label="Close"
                                        ></button>
                                      </div>

                                      <div className="modal-body">
                                        <div className="row g-3 ">
                                          <div className="col-md-12 col-lg">
                                            <form>
                                              <div className="form-group">
                                                <label>
                                                  Qualification Type:
                                                </label>
                                                <select
                                                  className="form-control"
                                                  name="qualificationType"
                                                  value={
                                                    formData.qualificationType
                                                  }
                                                  onChange={handleChange}
                                                  required
                                                >
                                                  <option value="">
                                                    Select
                                                  </option>
                                                  <option value="Certification">
                                                    Certification
                                                  </option>
                                                  <option value="Degree">
                                                    Degree
                                                  </option>
                                                  <option value="Diplamo">
                                                    Diplamo
                                                  </option>
                                                  <option value="PG">PG</option>
                                                  <option value="UG">UG</option>
                                                </select>
                                                <span className="text-danger">
                                                  {qualificationtype}
                                                </span>
                                              </div>
                                              <div className="form-group">
                                                <label>
                                                  Qualification Title:
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  name="qualificationTitle"
                                                  value={
                                                    formData.qualificationTitle
                                                  }
                                                  onChange={handleChange}
                                                  required
                                                />
                                                <span className="text-danger">
                                                  {qualificationTittle}
                                                </span>
                                              </div>
                                              {formData.qualificationType !==
                                                "Certification" && (
                                                <>
                                                  <div className="form-group">
                                                    <label>
                                                      Major Field of Study:
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name="MajorFeildOfStudy"
                                                      value={
                                                        formData.MajorFeildOfStudy
                                                      }
                                                      onChange={handleChange}
                                                    />
                                                    <span className="text-danger">
                                                      {majorfeildofstudy}
                                                    </span>
                                                  </div>
                                                  <div className="form-group">
                                                    <label>
                                                      Percentage or CGPA:
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name="percentageOrcgba"
                                                      value={
                                                        formData.percentageOrcgba
                                                      }
                                                      onChange={handleChange}
                                                    />
                                                    <span className="text-danger">
                                                      {percentageofcgba}
                                                    </span>
                                                  </div>
                                                </>
                                              )}
                                              <div className="form-group">
                                                <label>
                                                  Institute or College Name:
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  name="instituteOrCollegeName"
                                                  value={
                                                    formData.instituteOrCollegeName
                                                  }
                                                  onChange={handleChange}
                                                  required
                                                />
                                                <span className="text-danger">
                                                  {instituteorcollegeName}
                                                </span>
                                              </div>
                                              <div className="form-group">
                                                <label>Address:</label>
                                                <textarea
                                                  className="form-control"
                                                  name="Address"
                                                  value={formData.Address}
                                                  onChange={handleChange}
                                                  required
                                                />
                                                <span className="text-danger">
                                                  {address}
                                                </span>
                                              </div>
                                              {formData.qualificationType ===
                                              "Certification" ? (
                                                <>
                                                  <>
                                                    {editcertificate && (
                                                      <>
                                                        <label>
                                                          {filename}
                                                        </label>
                                                        <Button
                                                          type="link"
                                                          onClick={() => {
                                                            seteditcetificate(
                                                              false
                                                            );
                                                          }}
                                                        >
                                                          X
                                                        </Button>
                                                      </>
                                                    )}
                                                    {!editcertificate && (
                                                      <>
                                                        <div className="form-group">
                                                          <label>
                                                            Upload Document:
                                                          </label>
                                                          <input
                                                            type="file"
                                                            className="form-control"
                                                            name="certificate"
                                                            onChange={
                                                              handleChange
                                                            }
                                                            required
                                                          />
                                                          <span className="text-danger">
                                                            {document}
                                                          </span>
                                                        </div>
                                                      </>
                                                    )}
                                                  </>
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                            </form>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-bs-dismiss="modal"
                                          onClick={resetForm}
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="submit"
                                          className="btn text-white"
                                          onClick={handleUpdate}
                                          style={{
                                            backgroundColor:
                                              Styles.VarDarkGreen2,
                                          }}
                                        >
                                          Update certificate
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={previewVisible}
        title="Document Preview"
        footer={null}
        onCancel={handleCancelPreview}
      >
        {previewDocument && (
          <embed
            src={`data:${previewDocument.mimetype};base64,${btoa(
              new Uint8Array(previewDocument.buffer.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )}`}
            type={previewDocument.mimetype}
            width="100%"
            height="500px"
          />
        )}
      </Modal>
      <ToastContainer />
        
    </div>
  );
};
