import React, { useState } from 'react';
import { MessageCircle, FileText, CheckSquare, XSquare } from 'lucide-react';

const ComplaintResolution = () => {
    const [status, setStatus] = useState('In Review');

    return (
        <div className="complaint-container">
            <h2 className="page-title">// RESOLVE TICKETS {'{COMPLAINTS}'}</h2>

            <div className="ticket-layout">
                {/* Left Flow */}
                <div className="flow-panel">
                    <div className="flow-box dropdown">
                        Open ticket in the drop down form
                    </div>
                    <div className="connection-line"></div>

                    <div className={`flow-box ${status === 'In Review' ? 'active' : ''}`} onClick={() => setStatus('In Review')}>
                        In review
                    </div>
                    <div className="connection-line"></div>

                    <div className={`flow-box ${status === 'Resolved' ? 'active' : ''}`} onClick={() => setStatus('Resolved')}>
                        Resolved
                    </div>
                    <div className="connection-line"></div>

                    <div className={`flow-box ${status === 'Escalated' ? 'active' : ''}`} onClick={() => setStatus('Escalated')}>
                        Escalated
                    </div>
                </div>

                {/* Right Detail Panel */}
                <div className="ticket-detail-panel admin-card">
                    <div className="detail-header">
                        <h3>Basic Ticket Details #T-9920</h3>
                    </div>

                    <div className="complaint-text-box">
                        <h4>Buyer Complaint...</h4>
                        <p>"The item I received has a tear that was not mentioned in the description. Requesting a refund."</p>
                    </div>

                    <div className="evidence-split">
                        <div className="evidence-proofs">
                            <h4>Evidence proofs..</h4>
                            <div className="proof-icon"><FileText size={32} /></div>
                        </div>

                        <div className="admin-review-points">
                            <h4>Admin Notes and review Points</h4>
                            <textarea placeholder="Internal notes..."></textarea>
                        </div>
                    </div>

                    <div className="resolution-actions">
                        <button className="resolve-btn">Resolve</button>
                        <button className="close-btn">Close</button>
                    </div>
                </div>
            </div>

            <style>{`
        .ticket-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
        }

        /* Flow Panel */
        .flow-panel { display: flex; flex-direction: column; align-items: center; padding-top: 20px; }
        .flow-box {
          border: 2px solid #000; border-radius: 12px; padding: 16px;
          width: 100%; text-align: center; font-weight: 700; background: #fff;
          cursor: pointer;
        }
        .flow-box.active { background: #000; color: #fff; }
        .flow-box.dropdown { border-style: dashed; }
        
        .connection-line {
          width: 2px; height: 30px; background: #000;
          position: relative;
        }
        .connection-line::after {
          content: '▼'; position: absolute; bottom: -5px; left: -6px; font-size: 12px;
        }

        /* Detail Panel */
        .ticket-detail-panel {
          padding: 24px; border: 2px solid #000; border-radius: 20px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .detail-header { border: 2px solid #000; border-radius: 12px; padding: 12px; text-align: center; background: #fff; }
        .detail-header h3 { margin: 0; }

        .complaint-text-box {
          border: 2px solid #000; border-radius: 16px; padding: 20px; min-height: 100px;
        }
        .complaint-text-box h4 { margin-top: 0; }

        .evidence-split { display: flex; gap: 20px; height: 180px; }
        .evidence-proofs {
          flex: 1; border: 2px solid #000; border-radius: 16px; padding: 16px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .admin-review-points {
          flex: 1; border: 2px solid #000; border-radius: 16px; padding: 16px;
          display: flex; flex-direction: column;
        }
        .admin-review-points textarea {
          flex: 1; margin-top: 8px; border: 1px solid #cbd5e0; border-radius: 8px; padding: 8px;
        }

        .resolution-actions { display: flex; gap: 20px; justify-content: flex-end; margin-top: 10px; }
        .resolve-btn, .close-btn {
          border: 2px solid #000; padding: 10px 30px; border-radius: 8px;
          font-weight: 700; cursor: pointer; background: #fff;
        }
        .resolve-btn:hover, .close-btn:hover { background: #edf2f7; }
      `}</style>
        </div>
    );
};

export default ComplaintResolution;
