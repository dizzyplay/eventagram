import React, {useState} from "react"
import Card from "@material-ui/core/Card"
import {CardContent} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress"
import {getHashInfo} from "../api";

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    margin: '20px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: '1 0 auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    margin: '0',
  },
  split: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centered: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
}));

export function HashTag(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({...props})
  const classes = useStyles();

  const handleRefresh =async () => {
    setLoading(true)
    try{
      const res =await getHashInfo(data.name);
      setData({...res.data.hashTag})
      setLoading(false)
    }catch (e) {

    }
  };
  return (
    <>
      {loading ?
        <Card className={classes.card}>
          <CardContent className={classes.centered}>
            <CircularProgress/>
          </CardContent>
        </Card>
        :
        <Card className={classes.card}>
          <div className={classes.detail}>
            <CardContent className={classes.content}>
              <div className={classes.split}>
                <Typography component={'h5'} variant={'h5'} className={classes.split}>
                  #{data.name}
                </Typography>
                <div className={classes.split}>
                  <Typography variant={'caption'}>Media </Typography>
                  <Typography variant={'h5'} color={'primary'} style={{'padding': '10px'}}>
                    {data.mediaCount}
                  </Typography>
                  <button onClick={handleRefresh}>refresh</button>
                </div>
              </div>
              <Typography variant={'caption'} color={'textSecondary'}>
                {data.isProcessing ? 'ok' : 'not active'}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <CardContent>
                <Typography>
                  생성날짜: {data.createdAt}
                </Typography>
                <Typography>
                  마지막 갱신 날짜 : {data.updatedAt}
                </Typography>
              </CardContent>
            </div>
          </div>
        </Card>
      }
    </>
  )
}


