import React, { Component } from 'react'

export default class SOP extends Component {
    render() {
        return (
            <>
                <div className="App-section">
                    <h3 className="font-weight-bold text-uppercase m-0 mb-3">PANDUAN MENGHADIRI MAJLIS</h3>
                    <h5 className="m-0 mb-2">Tanggungjawab dan tindakan tetamu</h5>
                    <ul style={{textAlign:'justify', paddingLeft:'2rem'}}>
                        <li>Tidak digalakkan untuk bersalam dengan tuan rumah dan tetamu yang lain (Gantikan dengan meletakkan tangan kanan di dada disebelah kiri.)</li>
                        <li>Cuci tangan dengan bersih menggunakan sabun.</li>
                        <li>Individu bergejala dinasihatkan agar menjarakkan diri (<b>Social Distancing</b>) sekurang-kurangnya satu meter bila berhadapan dengan individu lain</li>
                        <li>Sekiranya bergejala, pakai topeng muka untuk menghadiri majlis kenduri atau lebih baik <b>tidak menghadiri majlis tersebut.</b></li>
                    </ul>

                    <h4 className="mt-3">Hanya tetamu yang lengkap 2 dos vaksinasi lepas 14 hari dibenarkan untuk hadir majlis ini.<br/>Sila ikuti slot yang anda telah pilih untuk hadir.</h4>
                    <h5 className="mt-5">Terima kasih kerana mematuhi SOP sepanjang anda berada di majlis kami!</h5>
                </div>
                
                <hr/>
            </>
        )
    }
}
