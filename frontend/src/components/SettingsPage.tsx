import { useMemo, useState } from "react";
import { useCredits } from "../lib/useCredits";

export default function SettingsPage() {
    const [credits, setCredits] = useCredits();
    const [topUpValue, setTopUpValue] = useState<string>('');
    const topUpValid = useMemo(() => topUpValue.length > 0 && !isNaN(Number(topUpValue)) && Number(topUpValue) > 0, [topUpValue]);

    return (
        <div>
            <h1>Settings</h1>
            <br />

            <div style={{ backgroundColor: '#00000055', borderRadius: '16px', padding: '32px 48px', textAlign: 'left' }}>
                <h3>Credits</h3>
                <p>You currently have <b>{credits ?? '-'}</b> credits.</p>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="topUpInput">Amount</label>
                        <input
                            type="number"
                            id="topUpInput"
                            placeholder="1000"
                            min={0}
                            style={{ width: '96px' }}
                            value={topUpValue}
                            onChange={(e) => setTopUpValue(e.currentTarget.value)}
                        />
                    </div>
                    <button
                        className="settingsPageButton"
                        disabled={!topUpValid}
                        onClick={() => {
                            if (credits == null) return;
                            setCredits(credits! + Number(topUpValue));
                            setTopUpValue('');
                            alert('Purchase succeeded - Credits bought!');
                        }}
                    >
                        Top up
                    </button>
                    <button
                        className="settingsPageButton"
                        disabled={!topUpValid}
                        onClick={() => {
                            if (credits == null) return;
                            if (credits - Number(topUpValue) < 0) {
                                alert("You can't withdraw more than you own!");
                                return;
                            }
                            setCredits(credits! - Number(topUpValue));
                            setTopUpValue('');
                            alert("Withdrawal completed!");
                        }}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    );
}
