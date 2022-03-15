import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { PictureService } from "../../../../@core/services/picture.service";
import { Lightbox } from 'ngx-lightbox';
import { NbUser } from '@nebular/auth';
import { Picture } from '../../../../@core/models/picture';

@Component({
  selector: 'ngx-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss']
})
export class PictureListComponent implements OnInit {

  childId:number;
  pictures:any[];
  _album:any[];
  constructor(private route:ActivatedRoute,
              private router:Router,
              private _lightbox: Lightbox,
              private pictureService:PictureService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(
      params => {
        this.childId = Number(params.get('childId'));
        return this.pictureService.getPicturesOfChild(this.childId);
      }
    )).subscribe((data) => {
      
      this.pictures = data.pictures; 
      
      this._album=[]
      this.pictures.forEach(item=>{
        
        this._album.push({src:item.image});
      })     
    })
  }
  add(){
    this.router.navigate(['add'],{relativeTo:this.route});
  }
  back(){
    this.router.navigate(['..'],{relativeTo:this.route})
  }
  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._album, index, {
          centerVertically: true,
          fitImageInViewPort: true
        });
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  removePicture(picture: any){
    this.pictureService.removePictures(picture).subscribe(_=>{
      this.pictures= this.pictures.filter(item => item.id != picture.id);
      this.pictures.forEach(item=>{
        this._album.push({src:item.image});
      }) 
    });
  }

}
