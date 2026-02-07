import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { useUser } from '@clerk/clerk-react';

const AddressModal = () => {
    const { isSignedIn, user } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            checkAddress();
        }
    }, [isSignedIn]);

    const checkAddress = async () => {
        try {
            const { data } = await userAPI.getProfile();
            if (!data.address || data.address.trim() === '') {
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error checking address:", error);
            // If 404, it might mean user doesn't exist in our DB yet, so we should prompt
            setShowModal(true);
        }
    };

    const handleSubmit = async () => {
        if (!address.trim()) return;
        setLoading(true);
        try {
            await userAPI.createOrUpdateProfile({
                email: user.primaryEmailAddress.emailAddress,
                address: address
            });
            setShowModal(false);
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Failed to save address");
        } finally {
            setLoading(false);
        }
    };

    if (!showModal) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginTop: 0 }}>Action Required</h3>
                <p>Please provide your shipping address to continue.</p>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address"
                    style={{ width: '100%', height: '100px', margin: '10px 0', padding: '10px' }}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        backgroundColor: '#FF5722', color: 'white', border: 'none', padding: '10px 20px',
                        borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%'
                    }}
                >
                    {loading ? 'Saving...' : 'Save Address'}
                </button>
            </div>
        </div>
    );
};

export default AddressModal;
