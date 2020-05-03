const config = require('./../config.js');
const path = require('path');

//CONSTS

let bot = {};
let paperTrading = {}
//CODE

let strategyData = require(path.resolve(__dirname, `./../strategies/rsi14Test/strategy.js`))


bot.actualCandle = undefined;
bot.lookback = [];

candleClose = [3884.01000000, 3951.64000000, 3769.84000000, 3508.75000000, 3403.55000000, 3410.93000000, 3545.37000000, 
    3432.88000000, 3380.39000000, 3445.00000000, 3302.06000000, 3224.17000000, 3211.72000000, 3228.67000000, 3509.08000000, 
    3652.98000000, 3662.22000000, 4049.62000000, 3838.66000000, 3948.91000000, 3929.71000000, 4008.01000000, 3745.79000000, 
    3777.74000000, 3567.91000000, 3839.26000000, 3695.32000000, 3801.91000000, 3702.90000000, 3797.14000000, 3858.56000000, 
    3766.78000000, 3792.01000000, 3770.96000000, 3987.60000000, 3975.45000000, 3955.13000000, 3966.65000000, 3585.88000000, 
    3601.31000000, 3583.13000000, 3476.81000000, 3626.09000000, 3553.06000000, 3591.84000000, 3616.21000000, 3594.87000000, 
    3665.30000000, 3539.28000000, 3526.90000000, 3570.93000000, 3552.82000000, 3569.62000000, 3565.29000000, 3565.25000000, 
    3550.84000000, 3434.15000000, 3411.04000000, 3458.18000000, 3434.10000000, 3462.07000000, 3504.77000000, 3458.11000000, 
    3463.22000000, 3471.59000000, 3405.37000000, 3398.40000000, 3659.04000000, 3665.18000000, 3680.06000000, 3631.05000000, 
    3631.46000000, 3609.40000000, 3590.56000000, 3602.47000000, 3618.41000000, 3667.58000000, 3898.60000000, 3907.79000000, 
    3969.74000000, 3937.31000000, 3962.00000000, 4117.76000000, 3743.56000000, 3827.92000000, 3809.23000000, 3818.07000000, 
    3813.69000000, 3823.00000000, 3819.93000000, 3807.75000000, 3715.30000000, 3857.73000000, 3861.84000000, 3873.64000000, 
    3864.89000000, 3943.04000000, 3916.82000000, 3871.61000000, 3882.73000000, 3866.00000000, 3877.12000000, 3923.76000000, 
    4005.98000000, 3981.14000000, 3987.81000000, 4015.53000000, 4043.04000000, 3980.64000000, 3986.93000000, 4006.01000000, 
    3992.18000000, 3936.12000000, 3948.55000000, 4038.05000000, 4027.81000000, 4103.25000000, 4106.97000000, 4103.95000000, 
    4144.56000000, 4857.29000000, 4932.60000000, 4898.66000000, 5004.95000000, 5043.89000000, 5170.27000000, 5236.90000000, 
    5150.00000000, 5308.25000000, 5017.37000000, 5048.01000000, 5045.22000000, 5131.30000000, 5024.95000000, 5173.72000000, 
    5202.82000000, 5258.44000000, 5258.68000000, 5291.73000000, 5256.14000000, 5357.14000000, 5493.31000000, 5415.00000000, 
    5219.90000000, 5314.10000000, 5295.69000000, 5307.52000000, 5238.14000000, 5320.81000000, 5383.20000000, 5492.87000000, 
    5772.69000000, 5829.45000000, 5775.62000000, 5747.79000000, 5846.34000000, 5987.29000000, 6209.18000000, 6373.33000000, 
    7076.22000000, 6967.31000000, 7790.71000000, 7947.56000000, 8169.87000000, 7866.59000000, 7355.26000000, 7257.45000000, 
    8148.48000000, 7938.15000000, 7904.87000000, 7628.43000000, 7851.51000000, 7964.87000000, 8025.41000000, 8614.43000000, 
    8756.32000000, 8715.64000000, 8645.68000000, 8269.54000000, 8555.00000000, 8544.07000000, 8725.98000000, 8115.82000000, 
    7687.03000000, 7776.50000000, 7786.70000000, 7980.53000000, 7893.62000000, 7628.13000000, 7982.75000000, 7884.90000000, 
    8127.64000000, 8218.54000000, 8650.00000000, 8808.70000000, 8953.33000000, 9313.96000000, 9081.55000000, 9255.49000000, 
    9517.12000000, 10159.86000000, 10729.50000000, 10906.07000000, 11056.59000000, 11820.86000000, 13093.80000000, 11329.99000000, 
    12400.63000000, 11903.13000000, 10854.10000000, 10624.93000000, 10842.85000000, 11940.00000000, 11145.67000000, 10970.73000000,
     11256.49000000, 11406.24000000, 12238.60000000, 12543.41000000, 12108.37000000, 11342.89000000, 11757.22000000, 11355.76000000,
      10174.18000000, 10838.72000000, 9439.59000000, 9667.92000000, 10627.16000000, 10504.29000000, 10740.23000000, 10589.45000000,
       10340.31000000, 9864.91000000, 9763.28000000, 9879.87000000, 9824.00000000, 9476.52000000, 9541.54000000, 9507.64000000,
        9574.21000000, 10080.53000000, 10374.99000000, 10523.75000000, 10816.86000000, 10929.23000000, 11828.80000000, 11481.69000000,
         11975.03000000, 11999.77000000, 11879.99000000, 11309.31000000, 11549.97000000, 11396.08000000, 10892.71000000, 10050.37000000,
          10293.93000000, 10331.54000000, 10216.02000000, 10306.78000000, 10915.54000000, 10760.51000000, 10142.57000000, 10099.88000000,
           10389.55000000, 10134.35000000, 10142.69000000, 10372.25000000, 10185.05000000, 9721.00000000, 9498.44000000, 9584.54000000,
            9587.47000000, 9724.98000000, 10340.00000000, 10615.28000000, 10567.02000000, 10564.49000000, 10298.73000000, 10455.88000000,
             10381.18000000, 10303.12000000, 10098.15000000, 10158.33000000, 10415.01000000, 10342.06000000, 10335.02000000, 10302.01000000,
              10251.31000000, 10187.82000000, 10156.99000000, 10244.29000000, 10168.59000000, 9986.39000000, 10028.87000000, 9702.25000000,
               8493.14000000, 8430.05000000, 8063.73000000, 8177.91000000, 8198.81000000, 8043.82000000, 8289.34000000, 8292.44000000, 8359.94000000,
                8223.96000000, 8137.13000000, 8126.19000000, 7854.25000000, 8190.09000000, 8168.39000000, 8560.74000000, 8558.03000000, 8258.50000000,
                 8300.09000000, 8275.01000000, 8348.20000000, 8159.29000000, 7991.74000000, 8070.58000000, 7947.01000000, 7948.01000000, 8223.35000000,
                  8197.27000000, 8020.00000000, 7466.62000000, 7412.41000000, 8655.02000000, 9230.00000000, 9529.93000000, 9205.14000000, 9407.62000000,
                   9154.72000000, 9140.85000000, 9231.61000000, 9289.52000000, 9194.71000000, 9393.35000000, 9308.66000000, 9339.05000000, 9216.20000000,
                    8773.73000000, 8809.41000000, 9039.47000000, 8733.27000000, 8821.94000000, 8777.12000000, 8646.68000000, 8471.73000000, 8491.02000000,
                     8502.40000000, 8187.17000000, 8133.64000000, 8098.01000000, 7627.74000000, 7268.23000000, 7311.57000000, 6903.28000000, 7109.57000000,
                      7156.14000000, 7508.52000000, 7419.49000000, 7739.68000000, 7541.89000000, 7390.89000000, 7294.28000000, 7292.71000000, 7194.32000000,
                       7389.00000000, 7527.47000000, 7488.21000000, 7510.11000000, 7338.64000000, 7224.13000000, 7210.00000000, 7198.08000000, 7258.48000000,
                        7064.05000000, 7118.59000000, 6891.72000000, 6623.82000000, 7277.83000000, 7150.30000000, 7187.83000000, 7132.75000000, 7501.44000000,
                         7317.09000000, 7255.77000000, 7204.63000000, 7202.00000000, 7254.74000000, 7316.14000000, 7388.24000000, 7246.00000000, 7195.23000000,
                          7200.85000000, 6965.71000000, 7344.96000000, 7354.11000000, 7358.75000000, 7758.00000000, 8145.28000000, 8055.98000000, 7817.76000000,
                           8197.02000000, 8020.01000000, 8184.98000000, 8110.34000000, 8810.01000000, 8821.41000000, 8720.01000000, 8913.28000000, 8915.96000000,
                            8701.70000000, 8642.35000000, 8736.03000000, 8682.36000000, 8404.52000000, 8439.00000000, 8340.58000000, 8615.00000000, 8907.57000000,
                             9374.21000000, 9301.53000000, 9513.21000000, 9352.89000000, 9384.61000000, 9331.51000000, 9292.24000000, 9197.02000000, 9612.04000000,
                              9772.00000000, 9813.73000000, 9895.05000000, 10151.75000000, 9851.83000000, 10223.08000000, 10326.46000000, 10229.63000000, 10344.36000000,
                               9904.72000000, 9917.27000000, 9706.00000000, 10164.71000000, 9593.79000000, 9596.42000000, 9677.05000000, 9650.86000000, 9936.40000000,
                                9656.13000000, 9315.84000000, 8785.25000000, 8823.21000000, 8692.91000000, 8523.61000000, 8531.88000000, 8915.24000000, 8760.07000000,
                                 8750.87000000, 9054.68000000, 9131.88000000, 8886.66000000, 8033.31000000, 7929.87000000, 7894.56000000, 7934.52000000]

candleClose1 = [0.0019685 ,0.0019674 ,0.0019667 ,0.001969 ,0.0019678 ,0.0019671 ,0.0019666 ,
    0.0019682 ,0.0019693 ,0.0019679 ,0.0019689 ,0.0019683 ,0.0019678 ,0.0019692 ,0.0019687 ,
    0.0019687 ,0.0019699 ,0.0019693 ,0.0019697 ,0.0019714 ,0.0019707 ,0.0019702 ,0.001971 ,
    0.0019715 ,0.00197 ,0.0019729 ,0.0019738 ,0.001972 ,0.0019732 ,0.0019739 ,0.0019728 ,0.0019718 ,
    0.0019682 ,0.0019661 ,0.0019639 ,0.0019634 ,0.0019633 ,0.0019631 ,0.0019628 ,0.0019627 ,0.001962 ,
    0.0019618 ,0.0019627 ,0.001959 ,0.0019593 ,0.0019575 ,0.0019585 ,0.0019585 ,0.0019592 ,0.0019581 ,
    0.0019585 ,0.00196 ,0.0019623 ,0.0019612 ,0.0019619 ,0.0019641 ,0.0019599 ,0.0019604 ,0.0019597 ,
    0.0019575 ,0.0019587 ,0.0019588 ,0.0019586 ,0.0019589 ,0.0019571 ,0.0019575 ,0.001959 ,0.0019598 ,
    0.0019596 ,0.0019611 ,0.0019598 ,0.0019607 ,0.0019619 ,0.0019613 ,0.0019626 ,0.0019625 ,0.0019634 ,
    0.0019633 ,0.0019623 ,0.0019623 ,0.0019622 ,0.0019615 ,0.0019618 ,0.0019616 ,0.0019626 ,0.0019624 ,0.0019618 ,
    0.0019634 ,0.0019643 ,0.0019616 ,0.0019641 ,0.0019658 ,0.0019647 ,0.0019658 ,0.0019646 ,0.0019649 ,0.0019664 ,
    0.0019656 ,0.001964] //El primero es el más antiguo

for (let i = 0; i < candleClose1.length; i++){
    if(i === 12) bot.enoughCandles = true;
    bot.actualCandle = {
        time: 12,
        close: parseFloat(candleClose1[i]),
    }
    strategyData.onCandle(bot)
    bot.lookback.unshift(bot.actualCandle);
}
