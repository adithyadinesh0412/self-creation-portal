import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'lib-certificates',
  standalone: true,
  imports: [TranslateModule, MatIconModule, MatRadioModule, MatSelectModule, MatFormFieldModule, FormsModule, CommonModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent {
  selectedOption: string = '1'; 
  certificateType = [ 
    {
    "label": "ONE_LOGO_ONE_SIGNATURE",
    "value": "type",
    "option": [
        {
            "label": "ONE_LOGO_ONE_SIGNATURE",
            "value": "ONE_LOGO_ONE_SIGNATURE"
        },
        {
            "label": "ONE_LOGO_TWO_SIGNATURES",
            "value": "ONE_LOGO_TWO_SIGNATURES"
        },
        {
            "label": "TWO_LOGOS_ONE_SIGNATURE",
            "value": "TWO_LOGOS_ONE_SIGNATURE"
        },
        {
            "label": "ONE_LOGOS_TWO_SIGNATURES",
            "value": "ONE_LOGOS_TWO_SIGNATURES"
        }
    ],
 },
] 
evidenceNumber = [1, 2, 3];
}