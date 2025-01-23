import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

const AnalyticsDashboard: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<{
        totalMoneyToTake: string;
        totalMoneyToRefund: string;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    // Fetch analytics data from the backend
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${SERVER}/super-admin/get-analytics`, { withCredentials: true }); // Replace with your API endpoint
                setAnalyticsData(response.data.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching analytics:", err);
                setError("Failed to fetch analytics data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading analytics data...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Analytics Dashboard</h1>
            <div className="d-flex justify-content-center gap-4">
                {/* Card for Total Money to Take */}
                <Card style={{ width: "18rem" }} className="text-center">
                    <Card.Body>
                        <Card.Title>Total Money to Keep</Card.Title>
                        <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            {analyticsData?.totalMoneyToTake || "N/A"}
                        </Card.Text>
                        <Card.Text>
                            This is the total amount to keep from agencies with active reservations.
                        </Card.Text>
                    </Card.Body>
                </Card>

                {/* Card for Total Money to Refund */}
                <Card style={{ width: "18rem" }} className="text-center">
                    <Card.Body>
                        <Card.Title>Total Money to Refund</Card.Title>
                        <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            {analyticsData?.totalMoneyToRefund || "N/A"}
                        </Card.Text>
                        <Card.Text>
                            This is the total amount to refund to agencies without reservations.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default AnalyticsDashboard;