import {Subject, forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';
import {Channel} from 'spyne';

export class ChannelPlaceholderCombinedData extends Channel{

  constructor(name, props={}) {
    name="CHANNEL_PLACEHOLDER_COMBINED_DATA";
    props.sendCachedPayload = true;

    super(name, props);
  }



  onRegistered(){

    const onMergeData = (e)=>{
      const placeholderData = e[0].payload;
      const nestedData = e[1].payload;
      this.props.data = {placeholderData, nestedData};

      //console.log("MERGED DATA ",{placeholderData, nestedData});
      const action = "CHANNEL_PLACEHOLDER_COMBINED_DATA_LOADED_EVENT";
      const payload = this.props.data;

      this.sendChannelPayload(action, payload);
    }

    const placeholderData$ = this.getChannel("CHANNEL_FETCH_PLACEHOLDER_APP_DATA")
        .pipe(take(1));
    const nestedData$ = this.getChannel("CHANNEL_NESTED_TEST_APP_DATA")
        .pipe(take(1));

    const combined$ = forkJoin(placeholderData$, nestedData$)
        .subscribe(onMergeData);


  }

  addRegisteredActions() {

    return [
        'CHANNEL_PLACEHOLDER_COMBINED_DATA_LOADED_EVENT'
    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
  }

}

