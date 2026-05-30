export default async function handler(req, res) {
    // Tolak jika bukan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { bank_code, account_number } = req.body;

    if (!bank_code || !account_number) {
        return res.status(400).json({ error: 'Bank code dan Account number wajib diisi' });
    }

    try {
        // Ambil API Key dari Environment Variable Vercel (aman, tidak ketahuan)
        const XENDIT_KEY = process.env.XENDIT_SECRET_KEY;
        
        // Panggil API Xendit
        const response = await fetch('https://api.xendit.co/bank_account_inquiries', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(XENDIT_KEY + ':').toString('base64'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bank_code: bank_code,
                bank_account_number: account_number
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Gagal validasi ke Xendit');
        }

        // Kirim hasil sukses ke HTML
        return res.status(200).json({
            success: true,
            account_number: data.bank_account_number,
            account_holder: data.account_holder_name
        });

    } catch (error) {
        // Kirim hasil gagal ke HTML
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
}
