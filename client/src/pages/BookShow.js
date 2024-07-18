import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { getShowById } from "../calls/shows";
import { useNavigate, useParams } from "react-router-dom";
import { message, Card, Row, Col, Button } from "antd";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import { bookShow, makePayment } from "../calls/bookings";

const BookShow = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(showLoading());
        const response = await getShowById({ showId: id });
        if (response.success) {
          setShow(response.data);
        } else {
          message.error(response.message);
        }
        dispatch(hideLoading());
      } catch (err) {
        message.error(err.message);
        dispatch(hideLoading());
      }
    };

    fetchData();
  }, [dispatch, id]);

  const handleSeatSelection = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatNumber)) {
        return prevSelectedSeats.filter((s) => s !== seatNumber);
      } else {
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

  const renderSeats = () => {
    if (!show) return null;

    const { totalSeats, bookedSeats } = show;
    const columns = 12;
    const rows = Math.ceil(totalSeats / columns);

    return (
      <div className="seat-selection">
        <div className="screen">
          <p>Screen this side, you will be watching in this direction</p>
        </div>
        <ul className="seat-ul">
          {Array.from(Array(rows).keys()).map((row) =>
            Array.from(Array(columns).keys()).map((column) => {
              const seatNumber = row * columns + column + 1;
              let seatClass = "seat-btn";
              if (selectedSeats.includes(seatNumber)) {
                seatClass += " selected";
              }
              if (bookedSeats.includes(seatNumber)) {
                seatClass += " booked";
              }
              return (
                seatNumber <= totalSeats && (
                  <li key={seatNumber}>
                    <button
                      className={seatClass}
                      onClick={() => handleSeatSelection(seatNumber)}
                    >
                      {seatNumber}
                    </button>
                  </li>
                )
              );
            })
          )}
        </ul>
      </div>
    );
  };

  const handlePayment = async (token) => {
    try {
      dispatch(showLoading());
      const response = await makePayment(
        token,
        selectedSeats.length * show.ticketPrice * 100
      );
      if (response.success) {
        message.success(response.message);
        await bookTickets(response.data.transactionId);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const bookTickets = async (transactionId) => {
    try {
      dispatch(showLoading());
      const response = await bookShow({
        show: id,
        transactionId,
        seats: selectedSeats,
        user: user._id,
      });
      if (response.success) {
        message.success("Show booking successful!");
        navigate("/profile");
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  return (
    <>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={<h1>{show.movie.title}</h1>}
              extra={<h3>Show Name: {show.name}</h3>}
            >
              <p>
                Theatre: {show.theatre.name}, {show.theatre.address}
              </p>
              <p>
                Date & Time:{" "}
                {moment(show.date).format("MMM Do YYYY")} at{" "}
                {moment(show.time, "HH:mm").format("hh:mm A")}
              </p>
              <p>Ticket Price: Rs. {show.ticketPrice}/-</p>
              <p>
                Total Seats: {show.totalSeats} | Available Seats:{" "}
                {show.totalSeats - show.bookedSeats.length}
              </p>

              {renderSeats()}

              {selectedSeats.length > 0 && (
                <div className="payment-section">
                  <p>
                    Selected Seats: {selectedSeats.join(", ")}
                  </p>
                  <p>
                    Total Price: Rs. {selectedSeats.length * show.ticketPrice}
                  </p>
                  <StripeCheckout
                    token={handlePayment}
                    amount={selectedSeats.length * show.ticketPrice * 100}
                    currency="INR"
                    stripeKey="your_stripe_publishable_key"
                  >
                    <Button type="primary" size="large">
                      Pay Now
                    </Button>
                  </StripeCheckout>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default BookShow;
