using Cryptofolio.Data;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ODataController
    {

        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public TransactionsController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/Transactions
        [EnableQuery]
        [HttpGet("/odata/Transactions")]
        public async Task<ActionResult<List<CoinTransactionSummaryDTO>>> GetTransactionsAsync()
        {

            if (_context.Transactions == null && _userAuthService.getCurrentUserId() == null)
            {
               return NotFound();
            }
            else if (_context.Transactions != null && _userAuthService.getCurrentUserId() != null)
            {


                List<TransactionDTO> transactions = _context.Transactions.OfType<Transaction>().Where(cs => cs.ApplicationUserId == _userAuthService.getCurrentUserId()).Include(c => c.ApplicationUser).Select(transactions => new TransactionDTO(transactions)).ToList();

                var transactionIds = transactions.Select(x => x.Id).ToList();

                Dictionary<int, FinanceTransactionBuy> coinBought = await _context.FinanceTransactionBuys.OfType<FinanceTransactionBuy>().Where(ft => transactionIds.Contains(ft.Id)).ToDictionaryAsync(g => g.Id);
                Dictionary<int, FinanceTransactionSell> coinsSold = await _context.FinanceTransactionSells?.OfType<FinanceTransactionSell>().Where(ft => transactionIds.Contains(ft.Id)).ToDictionaryAsync(g => g.Id) ;

                Dictionary<int, TransferTransactionIn> coinsTransferredIn = await _context.TransferTransactionIns?.OfType<TransferTransactionIn>().Where(ti => transactionIds.Contains(ti.Id)).ToDictionaryAsync(t => t.Id);
                Dictionary<int, TransferTransactionOut> coinsTransferredOut = await _context.TransferTransactionOuts?.OfType<TransferTransactionOut>().Where(ti => transactionIds.Contains(ti.Id)).ToDictionaryAsync(t => t.Id);

                Dictionary<string, List<TransactionDTO>> transactionsByCoin = transactions.GroupBy(t => t.CoinSymbol).ToDictionary(t => t.Key, t => t.ToList());

                List<CoinTransactionSummaryDTO> result = new();
                foreach(KeyValuePair<string, List<TransactionDTO>> coin in transactionsByCoin){
                    float profitLoss = 0;
                    foreach(var transaction in coin.Value)
                    {
                        var coinBoughtTransaction = coinBought.GetValueOrDefault(transaction.Id);
                        profitLoss += coinBoughtTransaction is not null ? coinBoughtTransaction.Price : 0;
                        var coinSoldTransaction = coinsSold.GetValueOrDefault(transaction.Id);
                        profitLoss -= coinSoldTransaction is not null ? coinSoldTransaction.Price : 0;

                    }

                    result.Add(new CoinTransactionSummaryDTO(
                        coin.Key, profitLoss));


                }

                return Ok(result);
            }
            else return BadRequest();

        }

        // GET: api/Transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            if (_context.Transactions == null)
            {
                return NotFound();
            }
            var transaction = await _context.Transactions.FindAsync(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }

        // PUT: api/Transactions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, [FromODataBody] TransactionDTO transactionDTO)
        {
            Transaction? transaction= await _context.Transactions.FirstOrDefaultAsync(x => x.Id == id);

            if (transaction == null)
            {
                if (id != transaction.Id)
                {
                    return BadRequest();
                }
                transaction.Id = transactionDTO.Id;

                _context.Entry(transaction).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TransactionExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

            }
            return NoContent();
        }

        [HttpPatch("{key}")]
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<TransactionDTO> transactionDTO)
        {
            if (_context.Transactions == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Transactions'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.Transactions.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<Transaction> deltaTransaction = TransactionDTO.toDeltaTransaction(transactionDTO);

            deltaTransaction.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Updated(entity);

        }



        // DELETE: api/Transactions/5
        [EnableQuery]
        [HttpDelete("/odata/Transactions({id})")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            if (_context.Transactions == null)
            {
                return NotFound();
            }
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionExists(int id)
        {
            return (_context.Transactions?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
