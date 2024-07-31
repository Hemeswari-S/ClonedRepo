import React, { useEffect, useState } from "react";
import Nodata from "../../Assets/Nodata.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import { Button, Card, ConfigProvider, Input, Modal } from "antd";
import { Styles } from "../../Config/Colors";
import { RestAPIURL } from "../../Config/Settings";
import axios from "axios";
import { sessionManager } from "../../Config/sessionmanager";
import dayjs from "dayjs";
import {
  ButtonColor,
  Variables,
  getActiveColors,
  getHoverColors,
} from "../../Config/Variables";
import { CircularProgress, InputLabel } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";

const apiurl = RestAPIURL + "/Leavemanager/";
export default function LEaveApprovalMnager() {
  const [TableData, SetTableData] = useState([]);
  const [IsMedical, setIsmedical] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);

  const [Data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetallforApproval();
  }, []);
  const SessName = sessionManager.getEmpName();

  const GetallforApproval = () => {
    axios.get(apiurl + "get/" + SessName).then((res) => {
      console.log(res.data);
      setIsLoading(false);
      SetTableData(res.data);
    });
  };
  const colorsButton = ButtonColor;
  const rejectButton = ["red", "red", "red"];
  const handleOpen = (id) => {
    GetbyId(id);

    setOpen(true);
  };
  const GetbyId = (id) => {
    console.log(id);
    axios.get(apiurl + "getBYId/" + id).then((result) => {
      console.log(result);
      setData(result.data);
      if (result.data.leaveType) {
        setIsmedical(true);
      } else {
        setIsmedical(false);
      }
      console.log(result.data);
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  const ActionUpdate = (ID, ActionText, Year) => {
    const SetData = {
      actionBy: SessName,
      leaveStatus: ActionText,
      _id: ID,
      year: Year,
    };
    axios.put(apiurl + "ActionUpdate", SetData).then((res) => {
      console.log(res.data);
      toast.success(res.data.message);
      handleClose();
      GetallforApproval();
    });
  };
  const handlePreview = (document) => {
    setPreviewDocument(document);
    setPreviewVisible(true);
  };
  const handleCancelPreview = () => {
    setPreviewVisible(false);
    setPreviewDocument(null);
  };
  return (
    <div>
      {isLoading ? (
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 285px)",
          }}
        >
          <CircularProgress color="success" />
        </div>
      ) : TableData.length !== 0 ? (
        <>
          <div className="row">
            <div className="col-lg-3 col-md-3 "></div>
            <div className="col-lg-6 col-md-6 col-xs-12">
              {isLoading ? (
                <div
                  className="container"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "calc(100vh - 285px)",
                  }}
                >
                  <CircularProgress color="success" />
                </div>
              ) : (
                TableData.map((data, index) => (
                  <Card
                    key={index}
                    bordered
                    hoverable
                    style={{
                      background:
                        `linear-gradient(` +
                        Styles.VarlightGreen2 +
                        `,` +
                        Styles.VarlightGreen1 +
                        `,` +
                        Styles.VarlightGreen2 +
                        `)`,
                      color: Styles.VarDarkGreen1,
                      width: "100%",
                      boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`,
                      marginBottom: "13px",
                    }}
                  >
                    <center>
                      {data.RequestedBY} has Requested Leave for {data.noOfDays}
                      Day(s) on {dayjs(data.startDate).format("MMMM")} Month . .
                      . .
                      <ConfigProvider
                        theme={{
                          components: {
                            Button: {
                              colorPrimary: `linear-gradient(90deg,  ${colorsButton.join(
                                ", "
                              )})`,
                              colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(
                                colorsButton
                              ).join(", ")})`,
                              colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(
                                colorsButton
                              ).join(", ")})`,
                              lineWidth: 0,
                            },
                          },
                        }}
                      >
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleOpen(data._id)}
                        >
                          View
                        </Button>
                      </ConfigProvider>
                    </center>
                  </Card>
                ))
              )}
            </div>
            <div className="col-lg-3 col-md-3 "></div>
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <img src={Nodata} alt="no data" height={300} className="img w-50" />
        </div>
      )}

      <Modal
        title="Leave Request Form"
        centered
        open={open}
        onCancel={() => {
          handleClose();
        }}
        okButtonProps={{ style: { display: "none" } }}
        footer={[
          <>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(116deg,  ${colorsButton.join(
                      ", "
                    )})`,
                    colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(
                      colorsButton
                    ).join(", ")})`,
                    colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(
                      colorsButton
                    ).join(", ")})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button
                type="primary"
                onClick={() => {
                  ActionUpdate(
                    Data._id,
                    Variables.ApprovedText,
                    new Date(Data.startDate).getFullYear()
                  );
                }}
              >
                Approve
              </Button>
            </ConfigProvider>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(116deg,  ${rejectButton.join(
                      ", "
                    )})`,
                    colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(
                      rejectButton
                    ).join(", ")})`,
                    colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(
                      rejectButton
                    ).join(", ")})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button
                type="primary"
                onClick={() => {
                  ActionUpdate(
                    Data._id,
                    Variables.RejectedText,
                    new Date(Data.startDate).getFullYear()
                  );
                }}
              >
                Reject
              </Button>
            </ConfigProvider>
          </>,
        ]}
      >
        <form>
          <InputLabel style={{ marginTop: 20 }} id="select-label">
            Requested By
          </InputLabel>
          <Input value={Data.RequestedBY} fullWidth disabled />
          <InputLabel style={{ marginTop: 20 }} id="select-label">
            LeaveType
          </InputLabel>
          <Input value={Data.leaveType} fullWidth disabled />
          <div className="row">
            <div className="col-6">
              <InputLabel style={{ marginTop: 20 }}>From </InputLabel>

              <Input
                value={new Date(Data.startDate).toLocaleDateString()}
                fullWidth
                disabled
              />
              <br />
            </div>
            <div className="col-6">
              <InputLabel style={{ marginTop: 20 }}> To </InputLabel>

              <Input
                value={new Date(Data.endDate).toLocaleDateString()}
                fullWidth
                disabled
              />
              <br />
            </div>
          </div>
          {IsMedical ? (
            <></>
          ) : (
            <>
              {" "}
              <InputLabel style={{ marginTop: 20 }}>Reason</InputLabel>
              <TextArea
                rows={4}
                placeholder="Reason "
                value={Data.reason}
                disabled
              />
            </>
          )}

          {IsMedical ? (<>
            <InputLabel style={{ marginTop: 20 }}>Evidence</InputLabel>

            <Button type="link" onClick={() => handlePreview(Data.Evidence)}>
              View Evidence
            </Button></>
          ) : (
            <></>
          )}
        </form>
      </Modal>
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
}
